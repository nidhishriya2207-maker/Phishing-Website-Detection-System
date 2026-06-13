import tls from 'tls';
export const analyzeSSL = (domain) => {
    return new Promise((resolve) => {
        const options = {
            host: domain,
            port: 443,
            servername: domain,
            rejectUnauthorized: false, // Don't crash on self-signed/expired certs
            timeout: 5000 // 5 seconds timeout
        };
        try {
            const socket = tls.connect(options, () => {
                const cert = socket.getPeerCertificate();
                const authorized = socket.authorized;
                if (!cert || Object.keys(cert).length === 0) {
                    resolve({
                        ssl_valid: false,
                        issuer: 'Unknown',
                        expiry: null,
                        https_enabled: true,
                        error: 'No certificate retrieved'
                    });
                    socket.destroy();
                    return;
                }
                const issuer = cert.issuer ? (cert.issuer.O || cert.issuer.CN || 'Unknown Issuer') : 'Unknown Issuer';
                const expiry = cert.valid_to ? new Date(cert.valid_to) : null;
                const now = new Date();
                const isExpired = expiry ? now > expiry : true;
                resolve({
                    ssl_valid: authorized && !isExpired,
                    issuer: typeof issuer === 'string' ? issuer : JSON.stringify(issuer),
                    expiry,
                    https_enabled: true
                });
                socket.destroy();
            });
            socket.on('error', (err) => {
                resolve({
                    ssl_valid: false,
                    issuer: 'Unknown',
                    expiry: null,
                    https_enabled: false,
                    error: err.message
                });
                socket.destroy();
            });
            socket.setTimeout(5000, () => {
                resolve({
                    ssl_valid: false,
                    issuer: 'Unknown',
                    expiry: null,
                    https_enabled: false,
                    error: 'Connection timed out'
                });
                socket.destroy();
            });
        }
        catch (err) {
            resolve({
                ssl_valid: false,
                issuer: 'Unknown',
                expiry: null,
                https_enabled: false,
                error: err.message
            });
        }
    });
};
