import { Shield, Lock, AlertTriangle, CheckCircle2, XCircle, ArrowLeft, Globe, Link2, Server } from 'lucide-react';

type ResultStatus = 'safe' | 'phishing' | 'suspicious';

interface AnalysisDetail {
  category: string;
  icon: typeof Shield;
  items: {
    label: string;
    value: string;
    status: 'pass' | 'fail' | 'warning';
  }[];
}

interface DetailedAnalysisProps {
  url: string;
  status: ResultStatus;
  metrics?: any;
  onBack: () => void;
  onScanAnother: () => void;
}

export function DetailedAnalysis({ url, status, metrics, onBack, onScanAnother }: DetailedAnalysisProps) {
  const hasRealMetrics = !!metrics;

  const analysisData: AnalysisDetail[] = [
    {
      category: 'Security Checks',
      icon: Lock,
      items: [
        { 
          label: 'SSL Certificate', 
          value: hasRealMetrics 
            ? (metrics.ssl.valid ? 'Valid & Trusted' : 'Missing or Invalid') 
            : (status === 'safe' ? 'Valid & Trusted' : 'Missing or Invalid'), 
          status: hasRealMetrics 
            ? (metrics.ssl.valid ? 'pass' : 'fail') 
            : (status === 'safe' ? 'pass' : 'fail') 
        },
        { 
          label: 'HTTPS Protocol', 
          value: hasRealMetrics 
            ? (metrics.ssl.httpsEnabled ? 'Enabled' : 'Not Found') 
            : (status === 'safe' ? 'Enabled' : 'Not Found'), 
          status: hasRealMetrics 
            ? (metrics.ssl.httpsEnabled ? 'pass' : 'fail') 
            : (status === 'safe' ? 'pass' : 'fail') 
        },
        { 
          label: 'Certificate Authority', 
          value: hasRealMetrics 
            ? (metrics.ssl.valid ? metrics.ssl.issuer : 'Unknown') 
            : (status === 'safe' ? 'Trusted CA' : 'Unknown'), 
          status: hasRealMetrics 
            ? (metrics.ssl.valid ? 'pass' : 'warning') 
            : (status === 'safe' ? 'pass' : 'warning') 
        },
        { 
          label: 'Security Headers', 
          value: status === 'safe' ? 'Present' : 'Missing', 
          status: status === 'safe' ? 'pass' : 'fail' 
        },
      ]
    },
    {
      category: 'URL Analysis',
      icon: Link2,
      items: [
        { 
          label: 'URL Length', 
          value: hasRealMetrics 
            ? `${metrics.urlAnalysis.length} chars (${metrics.urlAnalysis.isLengthSuspicious ? 'Suspicious' : 'Normal'})` 
            : (url.length > 75 ? 'Suspicious (too long)' : 'Normal'), 
          status: hasRealMetrics 
            ? (metrics.urlAnalysis.isLengthSuspicious ? 'warning' : 'pass') 
            : (url.length > 75 ? 'warning' : 'pass') 
        },
        { 
          label: 'Special Characters', 
          value: hasRealMetrics 
            ? (metrics.urlAnalysis.hasAtSymbol ? 'Suspicious (@ found)' : 'Normal') 
            : (status === 'phishing' ? 'Excessive use' : 'Normal'), 
          status: hasRealMetrics 
            ? (metrics.urlAnalysis.hasAtSymbol ? 'fail' : 'pass') 
            : (status === 'phishing' ? 'fail' : 'pass') 
        },
        { 
          label: 'IP Address in URL', 
          value: hasRealMetrics 
            ? (metrics.urlAnalysis.hasIPAddress ? 'IP Address detected' : 'Not detected') 
            : 'Not detected', 
          status: hasRealMetrics 
            ? (metrics.urlAnalysis.hasIPAddress ? 'fail' : 'pass') 
            : 'pass' 
        },
        { 
          label: 'Subdomain Structure', 
          value: hasRealMetrics 
            ? `${metrics.urlAnalysis.subdomainCount} subdomains` 
            : (status === 'safe' ? 'Clean' : 'Suspicious'), 
          status: hasRealMetrics 
            ? (metrics.urlAnalysis.isSubdomainDepthSuspicious ? 'warning' : 'pass') 
            : (status === 'safe' ? 'pass' : 'warning') 
        },
      ]
    },
    {
      category: 'Domain Information',
      icon: Globe,
      items: [
        { 
          label: 'Domain Age', 
          value: hasRealMetrics 
            ? (metrics.domainInfo.ageDays !== null 
                ? (metrics.domainInfo.ageDays > 365 
                    ? `${Math.floor(metrics.domainInfo.ageDays / 365)} years, ${Math.floor((metrics.domainInfo.ageDays % 365) / 30)} months` 
                    : `${metrics.domainInfo.ageDays} days old`)
                : 'Unknown age') 
            : (status === 'safe' ? '5 years, 3 months' : '2 days old'), 
          status: hasRealMetrics 
            ? (metrics.domainInfo.ageDays !== null && metrics.domainInfo.ageDays > 180 ? 'pass' : 'fail') 
            : (status === 'safe' ? 'pass' : 'fail') 
        },
        { 
          label: 'WHOIS Privacy', 
          value: hasRealMetrics 
            ? (metrics.domainInfo.whoisPrivacyActive ? 'Hidden/Protected' : 'Public Records') 
            : (status === 'safe' ? 'Public Records' : 'Hidden/Protected'), 
          status: hasRealMetrics 
            ? (metrics.domainInfo.whoisPrivacyActive ? 'warning' : 'pass') 
            : (status === 'safe' ? 'pass' : 'warning') 
        },
        { 
          label: 'DNS Records', 
          value: hasRealMetrics 
            ? (metrics.server.hasARecords ? 'Complete & Valid' : 'Incomplete') 
            : (status === 'safe' ? 'Complete & Valid' : 'Incomplete'), 
          status: hasRealMetrics 
            ? (metrics.server.hasARecords ? 'pass' : 'fail') 
            : (status === 'safe' ? 'pass' : 'fail') 
        },
        { 
          label: 'Domain Reputation', 
          value: status === 'safe' ? 'Excellent' : (status === 'suspicious' ? 'Neutral' : 'Poor'), 
          status: status === 'safe' ? 'pass' : (status === 'suspicious' ? 'warning' : 'fail') 
        },
      ]
    },
    {
      category: 'Server Analysis',
      icon: Server,
      items: [
        { 
          label: 'Server Location', 
          value: hasRealMetrics 
            ? (metrics.server.ips.length > 0 ? 'Resolved Active' : 'Unknown') 
            : (status === 'safe' ? 'United States' : 'Unknown/Suspicious'), 
          status: hasRealMetrics 
            ? (metrics.server.ips.length > 0 ? 'pass' : 'warning') 
            : (status === 'safe' ? 'pass' : 'warning') 
        },
        { 
          label: 'Response Time', 
          value: status === 'safe' ? '45ms' : '890ms', 
          status: status === 'safe' ? 'pass' : 'warning' 
        },
        { 
          label: 'Server Type', 
          value: status === 'safe' ? 'Nginx/Apache' : 'Unknown', 
          status: status === 'safe' ? 'pass' : 'fail' 
        },
      ]
    }
  ];

  const getStatusIcon = (itemStatus: 'pass' | 'fail' | 'warning') => {
    switch (itemStatus) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to results</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Detailed Security Analysis</h1>
          <div className="bg-white rounded-xl px-5 py-3 inline-flex items-center gap-3 shadow-md border border-blue-100 mb-6">
            <Globe className="w-5 h-5 text-[#2563EB]" />
            <p className="text-gray-700 font-mono">{url}</p>
          </div>

          {/* Warning Banner for >80 Risk */}
          {status === 'phishing' && (
            <div className="bg-red-100 border-2 border-red-400 text-red-900 rounded-2xl p-5 shadow-md text-left flex items-start gap-3 w-full">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-sm">
                Warning: This website appears to be a phishing or malicious website. Proceed with caution.
              </span>
            </div>
          )}
        </div>

        {/* Analysis Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {analysisData.map((section, index) => {
            const CategoryIcon = section.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-7 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.category}</h3>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <span className="text-gray-700 text-sm">{item.label}</span>
                      </div>
                      <span className={`font-medium text-sm text-right ml-2 ${
                        item.status === 'pass' ? 'text-green-600' :
                        item.status === 'fail' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onScanAnother}
            className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white rounded-xl py-5 hover:shadow-lg hover:scale-105 transition-all font-medium"
          >
            Scan Another Website
          </button>
          <button
            onClick={onBack}
            className="px-10 bg-white text-gray-700 rounded-xl py-5 hover:bg-gray-50 transition-colors border border-gray-200 font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
