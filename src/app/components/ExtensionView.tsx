import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { TechFloraLogo } from './TechFloraLogo';
import { useState, useEffect } from 'react';

type ExtensionStatus = 'safe' | 'phishing' | 'suspicious' | 'scanning';

interface ExtensionViewProps {
  currentUrl: string;
  status: ExtensionStatus;
  onViewFullReport: () => void;
}

export function ExtensionView({ currentUrl, status, onViewFullReport }: ExtensionViewProps) {
  const [blacklistCount, setBlacklistCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/blacklist/count')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setBlacklistCount(data.count);
        }
      })
      .catch(err => {
        console.error('Error fetching blacklist count:', err);
      });
  }, []);

  const getStatusConfig = (status: ExtensionStatus) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          textColor: 'text-green-900',
          iconColor: 'text-green-600',
          borderColor: 'border-green-300',
          label: 'This site is Safe',
          message: 'No phishing indicators detected',
          riskBar: 'bg-green-500',
          riskLevel: 5
        };
      case 'phishing':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          textColor: 'text-red-900',
          iconColor: 'text-red-600',
          borderColor: 'border-red-300',
          label: 'Phishing Detected',
          message: 'Do not enter personal information',
          riskBar: 'bg-red-500',
          riskLevel: 87
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-600',
          borderColor: 'border-yellow-300',
          label: 'Suspicious Site',
          message: 'Proceed with caution',
          riskBar: 'bg-yellow-500',
          riskLevel: 45
        };
      case 'scanning':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-900',
          iconColor: 'text-[#2563EB]',
          borderColor: 'border-blue-300',
          label: 'Scanning...',
          message: 'Analyzing website security',
          riskBar: 'bg-blue-400',
          riskLevel: 0
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="w-[350px] bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
          <TechFloraLogo className="w-full h-full" fillColor="#93C5FD" strokeColor="#2563EB" />
        </div>
        <div>
          <div className="font-semibold text-white">TechFlora</div>
          <div className="text-xs text-white/80">Protection Active</div>
        </div>
      </div>

      {/* Status Card */}
      <div className={`${config.bgColor} border-2 ${config.borderColor} m-5 rounded-xl p-5`}>
        <div className="flex items-start gap-3 mb-3">
          <Icon className={`w-7 h-7 ${config.iconColor} mt-0.5 ${status === 'scanning' ? 'animate-pulse' : ''} flex-shrink-0`} />
          <div className="flex-1">
            <h3 className={`font-bold ${config.textColor} mb-1 text-lg`}>{config.label}</h3>
            <p className="text-sm text-gray-600">{config.message}</p>
          </div>
        </div>

        {/* Risk Score Bar */}
        {status !== 'scanning' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Risk Level</span>
              <span className="font-semibold">{config.riskLevel}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${config.riskBar} transition-all duration-500`}
                style={{ width: `${config.riskLevel}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Current URL */}
      <div className="px-5 mb-5">
        <div className="text-xs text-gray-500 mb-2 font-medium">Current website</div>
        <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-mono truncate border border-gray-200">
          {currentUrl}
        </div>
      </div>

      {/* Quick Stats */}
      {status !== 'scanning' && (
        <div className="px-5 mb-5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">Blacklisted Sites</div>
              <div className="font-bold text-gray-900 text-lg">
                {blacklistCount !== null ? blacklistCount.toLocaleString() : '...'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">Domain Age</div>
              <div className={`font-bold text-lg ${status === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'safe' ? '5 years' : '2 days'}
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100 mb-3">
            <div className="text-xs text-gray-500 mb-1">Risk Score</div>
            <div className={`font-bold text-lg ${
              status === 'safe' ? 'text-green-600' :
              status === 'suspicious' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {status === 'safe' ? 'Low Risk' : status === 'suspicious' ? 'Average Risk' : 'High Risk'}
            </div>
          </div>

          {/* SSL and HTTPS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">SSL Certificate</div>
              <div className={`font-medium text-sm ${status === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'safe' ? 'Valid' : 'Invalid'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">HTTPS</div>
              <div className={`font-medium text-sm ${status === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'safe' ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 pb-5">
        <button
          onClick={onViewFullReport}
          className="w-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white rounded-xl py-3.5 hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <span>View Full Report</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 text-center border-t border-blue-200">
        <p className="text-xs text-gray-600">AI-powered real-time protection</p>
      </div>
    </div>
  );
}
