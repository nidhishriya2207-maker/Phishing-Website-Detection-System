import { ScanHistory } from '../models/ScanHistory.js';
import { Blacklist } from '../models/Blacklist.js';
import { computeRisk } from '../utils/riskEngine.js';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
const execPromise = util.promisify(exec);
export const scanUrl = async (req, res) => {
    const { url, source } = req.body;
    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL parameter is required and must be a string' });
        return;
    }
    try {
        const scanSource = source === 'extension' ? 'extension' : 'website';
        // 1. Check if domain/URL is already blacklisted
        let domain = '';
        try {
            const formattedUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;
            domain = new URL(formattedUrl).hostname;
        }
        catch {
            domain = url;
        }
        const blacklisted = await Blacklist.findOne({
            $or: [
                { url: url.toLowerCase() },
                { url: domain.toLowerCase() }
            ]
        });
        const isBlacklisted = !!blacklisted;
        // 2. Compute risk score using the multi-service engine
        const analysisReport = await computeRisk(url, isBlacklisted);
        // 3. Save scan to history database
        const historyItem = new ScanHistory({
            url: analysisReport.url,
            riskScore: analysisReport.riskScore,
            status: analysisReport.status,
            scanSource
        });
        await historyItem.save();
        // 4. Blacklist logic: Only add to blacklist database if verified via Google Safe Browsing (do not auto-blacklist on score alone)
        const isSafeBrowsingMalicious = analysisReport.reasons.some(r => r.includes('Google Safe Browsing'));
        if (isSafeBrowsingMalicious && !isBlacklisted) {
            const blacklistEntry = new Blacklist({
                url: domain.toLowerCase(), // Blacklist at domain level for wider security
                riskScore: analysisReport.riskScore,
                reason: analysisReport.reasons,
                firstDetected: new Date(),
                lastDetected: new Date()
            });
            await blacklistEntry.save().catch(err => {
                console.error('Error saving to blacklist:', err.message);
            });
        }
        else if (isBlacklisted && blacklisted) {
            // Update last detected timestamp
            blacklisted.lastDetected = new Date();
            await blacklisted.save().catch(err => {
                console.error('Error updating blacklist timestamp:', err.message);
            });
        }
        res.json(analysisReport);
    }
    catch (error) {
        console.error('Error scanning URL:', error);
        res.status(500).json({ error: 'Internal server error scanning URL', details: error.message });
    }
};
export const getScanHistory = async (req, res) => {
    try {
        const history = await ScanHistory.find()
            .sort({ timestamp: -1 })
            .limit(100); // Limit to last 100 scans for performance
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching scan history', details: error.message });
    }
};
export const getUrlReport = async (req, res) => {
    const urlParam = req.query.url;
    if (!urlParam || typeof urlParam !== 'string') {
        res.status(400).json({ error: 'URL query parameter is required' });
        return;
    }
    try {
        // Check if there is an existing history item
        const latestScan = await ScanHistory.findOne({ url: urlParam })
            .sort({ timestamp: -1 });
        // Also check blacklist status
        const blacklist = await Blacklist.findOne({ url: urlParam.toLowerCase() });
        if (!latestScan) {
            // If never scanned before, run a scan now
            const report = await computeRisk(urlParam, !!blacklist);
            res.json(report);
            return;
        }
        // Otherwise compute fresh risk or return cached check
        const report = await computeRisk(urlParam, !!blacklist);
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching URL report', details: error.message });
    }
};
export const getDomainDetails = async (req, res) => {
    const domainParam = req.query.domain;
    if (!domainParam || typeof domainParam !== 'string') {
        res.status(400).json({ error: 'Domain query parameter is required' });
        return;
    }
    try {
        const report = await computeRisk(domainParam, false);
        res.json({
            domain: domainParam,
            dns: report.metrics.server,
            whois: report.metrics.domainInfo,
            ssl: report.metrics.ssl
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching domain details', details: error.message });
    }
};
export const triggerRetrain = async (req, res) => {
    try {
        const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';
        const scriptPath = path.join(process.cwd(), 'scripts', 'train.py');
        console.log('[ML Pipeline] Manual retraining triggered...');
        const { stdout, stderr } = await execPromise(`${pythonCmd} "${scriptPath}" --force`);
        console.log(stdout);
        if (stderr)
            console.error(stderr);
        // Read the latest entry from retrain_history.json
        const historyPath = path.join(process.cwd(), 'src', 'utils', 'retrain_history.json');
        let history = [];
        if (fs.existsSync(historyPath)) {
            history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
        }
        const latestAttempt = history[history.length - 1] || null;
        res.json({
            message: 'Retraining process completed.',
            status: latestAttempt?.status || 'unknown',
            details: latestAttempt
        });
    }
    catch (error) {
        console.error('[ML Pipeline] Error during manual retraining:', error);
        res.status(500).json({ error: 'Manual retraining failed', details: error.message });
    }
};
export const getRetrainHistory = async (req, res) => {
    try {
        const historyPath = path.join(process.cwd(), 'src', 'utils', 'retrain_history.json');
        let history = [];
        if (fs.existsSync(historyPath)) {
            history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
        }
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching retraining history', details: error.message });
    }
};
