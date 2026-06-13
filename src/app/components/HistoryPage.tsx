import { CheckCircle2, XCircle, AlertTriangle, Clock, Home } from 'lucide-react';

type HistoryStatus = 'safe' | 'phishing' | 'suspicious';

interface HistoryItem {
  id: string;
  url: string;
  status: HistoryStatus;
  scannedAt: string;
  riskPercentage: number;
}

interface HistoryPageProps {
  history: HistoryItem[];
  onBack: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

export function HistoryPage({ history, onBack, onSelectItem }: HistoryPageProps) {
  const getStatusConfig = (status: HistoryStatus) => {
    switch (status) {
      case 'safe':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          label: 'Safe'
        };
      case 'phishing':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          label: 'Phishing'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          label: 'Suspicious'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Scan History</h1>
        <p className="text-gray-600 mb-8">View your previously scanned websites</p>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No history yet</h3>
            <p className="text-gray-600">Scanned websites will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const config = getStatusConfig(item.status);
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 ${config.bg} ${config.color} rounded-md text-xs font-medium`}>
                            {config.label}
                          </span>
                          <span className="text-sm text-gray-500">{item.scannedAt}</span>
                        </div>
                        <p className="text-gray-900 truncate font-mono text-sm">{item.url}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-2xl font-semibold text-gray-900">{item.riskPercentage}%</div>
                      <div className="text-xs text-gray-500">Risk</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
