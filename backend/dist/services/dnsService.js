import dns from 'dns/promises';
export const analyzeDNS = async (domain) => {
    try {
        // Resolve A records
        let ips = [];
        let dns_has_a_records = false;
        try {
            ips = await dns.resolve4(domain);
            dns_has_a_records = ips.length > 0;
        }
        catch (err) {
            // Ignore error, might just not have A records
        }
        // Resolve NS records
        let ns = [];
        let has_ns_records = false;
        try {
            ns = await dns.resolveNs(domain);
            has_ns_records = ns.length > 0;
        }
        catch (err) {
            // Ignore error
        }
        return {
            dns_has_a_records: dns_has_a_records,
            has_ns_records: has_ns_records,
            ips,
            ns
        };
    }
    catch (err) {
        return {
            dns_has_a_records: false,
            has_ns_records: false,
            ips: [],
            ns: [],
            error: err.message
        };
    }
};
