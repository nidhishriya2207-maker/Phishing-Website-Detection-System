import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, Home } from 'lucide-react';

type ResultStatus = 'safe' | 'phishing' | 'suspicious';

interface ScanResult {
  url: string;
  status: ResultStatus;
  riskPercentage: number;
  reasons: string[];
}

interface ResultPageProps {
  result: ScanResult;
  onViewDetails: () => void;
  onScanAnother: () => void;
}

export function ResultPage({ result, onViewDetails, onScanAnother }: ResultPageProps) {
  const getStatusConfig = (status: ResultStatus) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
          badgeColor: 'bg-green-500',
          label: 'Website is Safe',
          badge: 'SAFE',
          description: 'No phishing indicators detected'
        };
      case 'phishing':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
          badgeColor: 'bg-red-500',
          label: 'Phishing Detected',
          badge: 'PHISHING',
          description: 'This website may be dangerous'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-900',
          badgeColor: 'bg-yellow-500',
          label: 'Suspicious Activity',
          badge: 'SUSPICIOUS',
          description: 'Proceed with caution'
        };
    }
  };

  const config = getStatusConfig(result.status);
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Back to Home */}
        <button
          onClick={onScanAnother}
          className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] mb-8 transition-colors group"
        >
          <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Scan another website</span>
        </button>

        {/* Result Card */}
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-3xl p-10 mb-6 shadow-2xl`}>
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className={`${config.badgeColor} text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-md`}>
              {config.badge}
            </div>

            {/* Icon */}
            <div className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mb-6 border-4 ${config.borderColor} shadow-lg`}>
              <Icon className={`w-12 h-12 ${config.iconColor}`} />
            </div>

            <h2 className={`text-4xl font-bold ${config.textColor} mb-3`}>
              {config.label}
            </h2>

            <p className="text-gray-600 text-lg mb-6">{config.description}</p>

            <div className="bg-white rounded-xl px-5 py-3 mb-8 max-w-full overflow-hidden shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 truncate font-mono">{result.url}</p>
            </div>

            {/* Risk Percentage */}
            <div className="mb-8">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {result.riskPercentage}%
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {result.status === 'safe' ? 'Confidence Score' : 'Phishing Risk Level'}
              </div>
            </div>

            {/* Warning Banner for >80 Risk */}
            {result.riskPercentage > 80 && (
              <div className="w-full bg-red-100 border-2 border-red-400 text-red-900 rounded-2xl p-5 mb-6 shadow-md text-left flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-sm">
                  Warning: This website appears to be a phishing or malicious website. Proceed with caution.
                </span>
              </div>
            )}

            {/* Quick Reasons */}
            <div className="w-full bg-white rounded-2xl p-6 space-y-3 shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-left mb-4">Analysis Summary</h3>
              {result.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
                  <span className="text-gray-700">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white rounded-xl py-5 hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <span>View Detailed Analysis</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
