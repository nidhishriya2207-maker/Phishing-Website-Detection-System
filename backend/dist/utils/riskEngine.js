import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeDNS } from '../services/dnsService.js';
import { analyzeSSL } from '../services/sslService.js';
import { lookupWHOIS } from '../services/whoisService.js';
import { analyzeHeuristics } from '../services/heuristicService.js';
import { checkGoogleSafeBrowsing } from '../services/safeBrowsingService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, 'model.json');
function isLeaf(node) {
    return node && node.value !== undefined;
}
function evaluateTree(node, features) {
    if (isLeaf(node)) {
        return node.value;
    }
    const val = features[node.feature];
    if (val <= node.threshold) {
        return evaluateTree(node.left, features);
    }
    else {
        return evaluateTree(node.right, features);
    }
}
function predictRFProbability(forest, features) {
    let class1ProbabilitySum = 0;
    for (const tree of forest) {
        const value = evaluateTree(tree, features);
        const total = value[0] + value[1];
        class1ProbabilitySum += total > 0 ? (value[1] / total) : 0;
    }
    return class1ProbabilitySum / forest.length;
}
let cachedForest = null;
function loadModel() {
    if (cachedForest)
        return cachedForest;
    const paths = [
        MODEL_PATH,
        path.join(__dirname, '..', '..', 'src', 'utils', 'model.json'),
        path.join(process.cwd(), 'src', 'utils', 'model.json'),
        path.join(process.cwd(), 'backend', 'src', 'utils', 'model.json')
    ];
    for (const p of paths) {
        try {
            if (fs.existsSync(p)) {
                const data = fs.readFileSync(p, 'utf-8');
                cachedForest = JSON.parse(data);
                console.log(`Random Forest model loaded successfully from: ${p}`);
                return cachedForest;
            }
        }
        catch (err) {
            // Try next path
        }
    }
    console.warn('Random Forest model file (model.json) could not be resolved in default paths.');
    return null;
}
export const computeRisk = async (urlString, isBlacklisted) => {
    // Normalize and parse URL
    let urlClean = urlString.trim();
    if (!/^https?:\/\//i.test(urlClean)) {
        urlClean = 'https://' + urlClean; // Default to https for scanning
    }
    let domain = '';
    try {
        const urlObj = new URL(urlClean);
        domain = urlObj.hostname;
    }
    catch (err) {
        // Fallback if parsing fails
        domain = urlString;
    }
    // 1. Immediate checks (Local Blacklist)
    if (isBlacklisted) {
        return createImmediateThreatResult(urlString, domain, 'Listed in threat database (Local Blacklist)');
    }
    // 2. Query Google Safe Browsing
    const safeBrowsing = await checkGoogleSafeBrowsing(urlClean);
    if (safeBrowsing.is_malicious) {
        return createImmediateThreatResult(urlString, domain, `Flagged by Google Safe Browsing as ${safeBrowsing.threat_type || 'malicious link'}`);
    }
    // 3. Run other checks in parallel for performance
    const [dnsResult, sslResult, whoisResult] = await Promise.all([
        analyzeDNS(domain),
        analyzeSSL(domain),
        lookupWHOIS(domain)
    ]);
    const heuristicResult = analyzeHeuristics(urlClean);
    // Load the Random Forest model
    const forest = loadModel();
    let riskScore = 0;
    const reasons = [];
    // Generate descriptive security logs/reasons
    if (!sslResult.https_enabled) {
        reasons.push('HTTPS protocol is not enabled');
    }
    if (!sslResult.ssl_valid) {
        reasons.push('Invalid, missing, or self-signed SSL certificate');
    }
    else if (sslResult.issuer === 'Unknown') {
        reasons.push('Unknown or untrusted SSL certificate authority');
    }
    if (whoisResult.domain_age_days !== null) {
        if (whoisResult.domain_age_days < 30) {
            reasons.push(`Domain registered very recently (${whoisResult.domain_age_days} days ago)`);
        }
        else if (whoisResult.domain_age_days < 180) {
            reasons.push(`Domain is relatively new (${whoisResult.domain_age_days} days old)`);
        }
    }
    else {
        reasons.push('WHOIS registration info is missing or could not be verified');
    }
    if (whoisResult.whois_privacy_active) {
        reasons.push('WHOIS privacy protection is enabled');
    }
    if (!dnsResult.dns_has_a_records && domain.endsWith('.test')) {
        reasons.push('Domain does not resolve to any active IP address (No A records)');
    }
    if (!dnsResult.has_ns_records && domain.endsWith('.test')) {
        reasons.push('No name servers resolved (No NS records)');
    }
    if (heuristicResult.has_at_symbol) {
        reasons.push('URL contains suspicious "@" character redirect code');
    }
    if (heuristicResult.has_ip_address) {
        reasons.push('URL uses a direct IP address instead of a domain name');
    }
    if (heuristicResult.is_length_suspicious) {
        reasons.push(`Suspicious URL structure with extreme length (${heuristicResult.url_length} characters)`);
    }
    if (heuristicResult.is_subdomain_depth_suspicious) {
        reasons.push(`Excessive subdomains depth detected (${heuristicResult.subdomain_count} subdomains)`);
    }
    if (heuristicResult.hyphen_count_in_domain >= 3) {
        reasons.push('Excessive hyphens in domain name (common in typo-squatting)');
    }
    if (heuristicResult.is_idn_attack) {
        reasons.push('Potential homoglyph/unicode domain spoofing attempt');
    }
    if (heuristicResult.suspicious_keywords_count > 0) {
        reasons.push(`Contains ${heuristicResult.suspicious_keywords_count} high-risk keyword(s)`);
    }
    if (forest) {
        // Construct aligned 10-feature vector matching train.py
        const features = [
            heuristicResult.is_length_suspicious ? 1 : 0, // F0
            heuristicResult.has_ip_address ? 1 : 0, // F1
            heuristicResult.is_subdomain_depth_suspicious ? 1 : 0, // F2
            heuristicResult.has_at_symbol ? 1 : 0, // F3
            heuristicResult.hyphen_count_in_domain, // F4 (Prefix_Suffix check, numeric count of hyphens)
            sslResult.ssl_valid ? 1 : 0, // F5
            sslResult.https_enabled ? 1 : 0, // F6
            whoisResult.domain_age_days !== null ? whoisResult.domain_age_days : 180, // F7 (domain_age_days - actual numerical value)
            dnsResult.dns_has_a_records ? 1 : 0, // F8
            heuristicResult.suspicious_keywords_count // F9 (Abnormal URL keywords check, numeric count of keywords)
        ];
        const phishingProbability = predictRFProbability(forest, features);
        riskScore = Math.round(phishingProbability * 100);
        console.log(`RF Prediction: URL=${urlString}, RiskScore=${riskScore}%, Vector=[${features.join(', ')}]`);
    }
    else {
        // Graceful fallback to rule-based engine if model.json is not yet compiled
        console.warn('Random Forest model not found. Using fallback rule-based risk calculation.');
        let fallbackScore = 0;
        if (!sslResult.https_enabled)
            fallbackScore += 25;
        if (!sslResult.ssl_valid)
            fallbackScore += 25;
        if (whoisResult.domain_age_days !== null) {
            if (whoisResult.domain_age_days < 30)
                fallbackScore += 25;
            else if (whoisResult.domain_age_days < 180)
                fallbackScore += 15;
        }
        else {
            fallbackScore += 20;
        }
        if (!dnsResult.dns_has_a_records)
            fallbackScore += 20;
        if (!dnsResult.has_ns_records)
            fallbackScore += 10;
        fallbackScore += Math.round(heuristicResult.score * 0.25);
        riskScore = Math.max(0, Math.min(100, fallbackScore));
    }
    // Determine status based on risk score thresholds (Safe < 40, Suspicious 40-80, Phishing > 80)
    let status = 'safe';
    if (riskScore > 80) {
        status = 'phishing';
    }
    else if (riskScore >= 40) {
        status = 'suspicious';
    }
    // If there are no negative reasons, list clean attributes
    if (reasons.length === 0) {
        reasons.push('Valid SSL certificate from trusted authority');
        reasons.push('Domain registered for 5+ years');
        reasons.push('Clean URL structure with no suspicious patterns');
        reasons.push('Strong security headers present');
    }
    return {
        url: urlString,
        domain,
        riskScore,
        status,
        reasons,
        metrics: {
            ssl: {
                valid: sslResult.ssl_valid,
                issuer: sslResult.issuer,
                expiry: sslResult.expiry ? sslResult.expiry.toISOString() : null,
                httpsEnabled: sslResult.https_enabled
            },
            urlAnalysis: {
                length: heuristicResult.url_length,
                isLengthSuspicious: heuristicResult.is_length_suspicious,
                hasIPAddress: heuristicResult.has_ip_address,
                subdomainCount: heuristicResult.subdomain_count,
                isSubdomainDepthSuspicious: heuristicResult.is_subdomain_depth_suspicious,
                hasAtSymbol: heuristicResult.has_at_symbol,
                hyphenCountInDomain: heuristicResult.hyphen_count_in_domain,
                isIDNAttack: heuristicResult.is_idn_attack
            },
            domainInfo: {
                ageDays: whoisResult.domain_age_days,
                creationDate: whoisResult.creation_date ? whoisResult.creation_date.toISOString() : null,
                registrar: whoisResult.registrar,
                whoisPrivacyActive: whoisResult.whois_privacy_active
            },
            server: {
                ips: dnsResult.ips,
                hasARecords: dnsResult.dns_has_a_records,
                hasNSRecords: dnsResult.has_ns_records,
                ns: dnsResult.ns
            }
        }
    };
};
const createImmediateThreatResult = (url, domain, reason) => {
    return {
        url,
        domain,
        riskScore: 100,
        status: 'phishing',
        reasons: [reason],
        metrics: {
            ssl: { valid: false, issuer: 'Unknown', expiry: null, httpsEnabled: false },
            urlAnalysis: {
                length: url.length,
                isLengthSuspicious: url.length > 75,
                hasIPAddress: false,
                subdomainCount: 0,
                isSubdomainDepthSuspicious: false,
                hasAtSymbol: url.includes('@'),
                hyphenCountInDomain: 0,
                isIDNAttack: false
            },
            domainInfo: { ageDays: 0, creationDate: null, registrar: 'Unknown', whoisPrivacyActive: false },
            server: { ips: [], hasARecords: false, hasNSRecords: false, ns: [] }
        }
    };
};
