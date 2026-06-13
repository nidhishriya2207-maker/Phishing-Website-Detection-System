import { Lock, CheckCircle2, Zap, Chrome } from 'lucide-react';
import { TechFloraLogo } from './TechFloraLogo';

interface LandingPageProps {
  onScan: (url: string) => void;
  onScrollToExtension: () => void;
}

export function LandingPage({ onScan, onScrollToExtension }: LandingPageProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url.trim()) {
      onScan(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <TechFloraLogo className="w-12 h-12" />
          <span className="font-semibold text-gray-900 text-lg">TechFlora</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-gray-600 hover:text-[#2563EB] transition-colors">Features</a>
          <a href="#extension" onClick={onScrollToExtension} className="text-gray-600 hover:text-[#2563EB] transition-colors">Extension</a>
          <a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Detect Phishing Websites
            <br />
            <span className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered protection for safer browsing. Check any URL in seconds with our advanced machine learning detection.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-3 max-w-2xl mx-auto border border-blue-100">
              <input
                type="text"
                name="url"
                placeholder="https://example.com"
                className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
              >
                Scan Now
              </button>
            </div>
          </form>

          {/* Secondary CTA */}
          <button
            onClick={onScrollToExtension}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2563EB] rounded-xl hover:bg-blue-50 transition-colors border border-blue-200 shadow-md"
          >
            <Chrome className="w-5 h-5" />
            <span className="font-medium">Get Chrome Extension</span>
          </button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span>No data stored</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span>Real-time analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span>AI-powered detection</span>
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-20 bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 border border-blue-100 shadow-lg">
            <div className="flex items-center justify-center gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-blue-200 p-2">
                <TechFloraLogo className="w-full h-full" />
              </div>
              <div className="text-5xl text-blue-200 font-light">→</div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <p className="text-gray-500 mt-6">Instant security analysis powered by ML</p>
          </div>
        </div>
      </main>
    </div>
  );
}
