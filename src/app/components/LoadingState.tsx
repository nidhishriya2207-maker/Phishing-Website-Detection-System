import { TechFloraLogo } from './TechFloraLogo';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg p-4">
            <TechFloraLogo className="w-full h-full animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Analyzing website security...
        </h2>
        <p className="text-gray-600 text-lg">
          Our AI is checking the URL for potential threats
        </p>

        {/* Progress Bar */}
        <div className="mt-8 bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>

        <p className="text-sm text-gray-500 mt-4">This usually takes just a few seconds</p>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
