import { useState, useRef, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { FeaturesSection } from './components/FeaturesSection';
import { ExtensionPromotion } from './components/ExtensionPromotion';
import { Footer } from './components/Footer';
import { LoadingState } from './components/LoadingState';
import { ResultPage } from './components/ResultPage';
import { DetailedAnalysis } from './components/DetailedAnalysis';
import { ExtensionView } from './components/ExtensionView';
import { Monitor, Chrome } from 'lucide-react';

type View = 'landing' | 'loading' | 'result' | 'details';
type ViewMode = 'web' | 'extension';
type ResultStatus = 'safe' | 'phishing' | 'suspicious';

interface ScanResult {
  url: string;
  status: ResultStatus;
  riskPercentage: number;
  reasons: string[];
  metrics?: any;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const extensionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  console.log("VIEW CHANGED:", view);
}, [view]);

useEffect(() => {
  console.log("CURRENT RESULT:", currentResult);
}, [currentResult]);

  // Check URL query parameters for automatic scanning (triggered from extension full report button)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      handleScan(urlParam);
      // Clean query parameter from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const runMockScan = (url: string) => {
    const isPhishing = url.includes('phish') || url.includes('fake') || url.includes('scam');
    const isSuspicious = url.includes('suspicious') || url.includes('warn');

    let status: ResultStatus = 'safe';
    let riskPercentage = 5;
    let reasons: string[] = [];

    if (isPhishing) {
      status = 'phishing';
      riskPercentage = 87;
      reasons = [
        'No SSL certificate detected',
        'Suspicious URL structure with misleading characters',
        'Domain registered less than 7 days ago',
        'Multiple redirects detected'
      ];
    } else if (isSuspicious) {
      status = 'suspicious';
      riskPercentage = 45;
      reasons = [
        'WHOIS information is hidden',
        'Unusual domain extension',
        'Limited online presence',
        'Recent domain registration'
      ];
    } else {
      status = 'safe';
      riskPercentage = 5; // Default safe risk score below 40
      reasons = [
        'Valid SSL certificate from trusted authority',
        'Domain registered for 5+ years',
        'Clean URL structure with no suspicious patterns',
        'Strong security headers present'
      ];
    }

    const result: ScanResult = {
      url,
      status,
      riskPercentage,
      reasons
    };

    setCurrentResult(result);
    setView('result');
  };

  const handleScan = async (url: string) => {
    console.log("HANDLESCAN CALLED");
    setView('loading');

    try {
      console.log("BEFORE FETCH");

      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, source: 'website' })
      });

      console.log("AFTER FETCH");
      console.log(response);

      if (!response.ok) {
        throw new Error('API response failed');
      }

      const data = await response.json();

      console.log("DATA RECEIVED");
      console.log(data);
      
      const result: ScanResult = {
        url: data.url,
        status: data.status,
        riskPercentage: data.riskScore,
        reasons: data.reasons,
        metrics: data.metrics
      };

      setCurrentResult(result);
      setView('result');
      console.log("SETTING RESULT PAGE");
      console.log(result);
    } catch (err) {
  console.error('API ERROR:', err);
    }
  };

  const handleScanAnother = () => {
    setView('landing');
    setCurrentResult(null);
  };

  const scrollToExtension = () => {
    extensionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetExtension = () => {
    window.location.href = 'http://localhost:5000/api/extension/download';
    setViewMode('extension');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <>
            <LandingPage onScan={handleScan} onScrollToExtension={scrollToExtension} />
            <FeaturesSection />
            <div ref={extensionRef}>
              <ExtensionPromotion onGetExtension={handleGetExtension} />
            </div>
            <Footer />
          </>
        );

      case 'loading':
        return <LoadingState />;

      case 'result':
        return currentResult ? (
          <ResultPage
            result={currentResult}
            onViewDetails={() => setView('details')}
            onScanAnother={handleScanAnother}
          />
        ) : null;

      case 'details':
        return currentResult ? (
          <DetailedAnalysis
            url={currentResult.url}
            status={currentResult.status}
            metrics={currentResult.metrics}
            onBack={() => setView('result')}
            onScanAnother={handleScanAnother}
          />
        ) : null;

      default:
        return <LandingPage onScan={handleScan} onScrollToExtension={scrollToExtension} />;
    }
  };

  return (
    <div className="size-full bg-white overflow-auto">
      {/* View Mode Toggle */}
      <div className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-xl p-1.5 flex gap-1 border-2 border-blue-100">
        <button
          onClick={() => setViewMode('web')}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
            viewMode === 'web'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span className="text-sm">Web App</span>
        </button>
        <button
          onClick={() => setViewMode('extension')}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-medium ${
            viewMode === 'extension'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50'
          }`}
        >
          <Chrome className="w-4 h-4" />
          <span className="text-sm">Extension</span>
        </button>
      </div>

      {/* Main Content */}
      {viewMode === 'web' ? (
        <div className="w-full min-h-full">
          {renderView()}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white p-8">
          <ExtensionView
            currentUrl={currentResult ? currentResult.url : ""}
            status={currentResult ? currentResult.status : 'safe'}
            onViewFullReport={() => setViewMode('web')}
          />
        </div>
      )}
    </div>
  );
}