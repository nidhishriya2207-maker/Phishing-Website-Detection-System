import { TechFloraLogo } from './TechFloraLogo';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <TechFloraLogo className="w-12 h-12" />
              <span className="font-semibold text-gray-900 text-lg">TechFlora</span>
            </div>
            <p className="text-gray-600 max-w-sm">
              AI-powered phishing detection to keep you safe online. Protecting users from malicious websites since 2024.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">Extension</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">How it works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#2563EB] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 TechFlora. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Powered by machine learning • No data stored
          </p>
        </div>
      </div>
    </footer>
  );
}
