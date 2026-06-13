import { Shield, Zap, BarChart3, Lock } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Real-time Detection',
      description: 'Instant phishing analysis using advanced ML algorithms'
    },
    {
      icon: BarChart3,
      title: 'URL Analysis',
      description: 'Deep inspection of domain structure and security indicators'
    },
    {
      icon: Lock,
      title: 'Security Insights',
      description: 'Detailed reports on SSL, HTTPS, and certificate validation'
    },
    {
      icon: Zap,
      title: 'Lightweight & Fast',
      description: 'Minimal performance impact with instant results'
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Protection Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced technology designed to keep you safe from phishing attacks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#93C5FD] rounded-xl flex items-center justify-center mb-5 shadow-md">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
