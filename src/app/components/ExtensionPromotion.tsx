import { Chrome, CheckCircle2 } from 'lucide-react';
import { TechFloraLogo } from './TechFloraLogo';

interface ExtensionPromotionProps {
  onGetExtension: () => void;
}

export function ExtensionPromotion({ onGetExtension }: ExtensionPromotionProps) {
  return (
    <section id="extension" className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-[#2563EB] px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
                <Chrome className="w-4 h-4" />
                <span>Browser Extension</span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Stay Protected Automatically
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Install our browser extension for real-time phishing detection while you browse. Get instant alerts and stay safe without any extra effort.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Automatic scanning of every website you visit</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Instant alerts for suspicious websites</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Lightweight and fast performance</span>
                </li>
              </ul>

              <button
                onClick={onGetExtension}
                className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white px-8 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium w-fit flex items-center gap-2"
              >
                <Chrome className="w-5 h-5" />
                <span>Download Extension</span>
              </button>
            </div>

            {/* Mock Browser Visual */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-12 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-blue-200">
                {/* Browser Chrome */}
                <div className="bg-gray-100 rounded-t-xl px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 ml-2">
                    example.com
                  </div>
                </div>

                {/* Extension Popup */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TechFloraLogo className="w-10 h-10" />
                    <div>
                      <div className="font-semibold text-gray-900">TechFlora</div>
                      <div className="text-xs text-gray-500">Extension Active</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">This site is Safe</span>
                    </div>
                    <p className="text-sm text-gray-600">No phishing indicators detected</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SSL Certificate</span>
                      <span className="text-green-600 font-medium">✓ Valid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Domain Age</span>
                      <span className="text-green-600 font-medium">5 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
