// @ts-ignore
let whois;
(async () => {
    whois = (await import('whois')).default;
})();
export const lookupWHOIS = (domain) => {
    return new Promise(async (resolve) => {
        try {
            // Import whois dynamically inside the function
            const whoisModule = await import('whois');
            const whois = whoisModule.default || whoisModule;
            whois.lookup(domain, (err, data) => {
                if (err) {
                    resolve({
                        creation_date: null,
                        domain_age_days: null,
                        registrar: 'Unknown',
                        whois_privacy_active: false,
                        error: err.message
                    });
                    return;
                }
                try {
                    const text = data || '';
                    let creation_date = null;
                    let registrar = 'Unknown';
                    let whois_privacy_active = false;
                    // Parse creation date
                    const creationDateRegex = /(?:creation date|created|created on|created_at|registration date|registered on):\s*([^\n\r]+)/i;
                    const matchDate = text.match(creationDateRegex);
                    if (matchDate && matchDate[1]) {
                        const parsedDate = new Date(matchDate[1].trim());
                        if (!isNaN(parsedDate.getTime())) {
                            creation_date = parsedDate;
                        }
                    }
                    // Parse registrar
                    const registrarRegex = /(?:registrar|registrar name|sponsoring registrar):\s*([^\n\r]+)/i;
                    const matchRegistrar = text.match(registrarRegex);
                    if (matchRegistrar && matchRegistrar[1]) {
                        registrar = matchRegistrar[1].trim();
                    }
                    // Check for common WHOIS privacy phrases
                    const privacyKeywords = [
                        'privacy protect',
                        'whois protector',
                        'contact privacy',
                        'domains by proxy',
                        'super privacy',
                        'withheld for privacy',
                        'redacted for privacy',
                        'gdpr redacted',
                        'identity protection'
                    ];
                    whois_privacy_active = privacyKeywords.some(keyword => text.toLowerCase().includes(keyword));
                    // Calculate age
                    let domain_age_days = null;
                    if (creation_date) {
                        const now = new Date();
                        const diffTime = Math.abs(now.getTime() - creation_date.getTime());
                        domain_age_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                    resolve({
                        creation_date,
                        domain_age_days: domain_age_days,
                        registrar,
                        whois_privacy_active: whois_privacy_active,
                        raw: text.slice(0, 1000)
                    });
                }
                catch (parseError) {
                    resolve({
                        creation_date: null,
                        domain_age_days: null,
                        registrar: 'Unknown',
                        whois_privacy_active: false,
                        error: 'Parsing error: ' + parseError.message
                    });
                }
            });
        }
        catch (err) {
            resolve({
                creation_date: null,
                domain_age_days: null,
                registrar: 'Unknown',
                whois_privacy_active: false,
                error: 'Failed to load whois module: ' + err.message
            });
        }
    });
};
