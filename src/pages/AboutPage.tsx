import { Info, Shield, Database, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">About EnviroSentinel Pro</h1>
          <p className="text-lg text-gray-700 mb-6">
            EnviroSentinel Pro is a comprehensive environmental monitoring and risk assessment platform that combines real-time data from multiple sources to provide actionable insights for climate resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 rounded-full p-3 mr-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Real-Time Monitoring</h2>
            </div>
            <p className="text-gray-700">
              Track floods, wildfires, heat waves, and pollution events as they develop with multi-source data integration and predictive analytics.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Multi-Source Integration</h2>
            </div>
            <p className="text-gray-700">
              Aggregates data from satellites, weather stations, sensors, and community reports to provide comprehensive coverage.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Predictive Analytics</h2>
            </div>
            <p className="text-gray-700">
              Machine learning models forecast environmental risks hours to days in advance, enabling proactive response.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Community-Powered</h2>
            </div>
            <p className="text-gray-700">
              Crowdsourced reports enhance situational awareness and provide ground-truth validation of model predictions.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2 text-emerald-600" />
            Our Mission
          </h2>
          <p className="text-gray-700 mb-4">
            We believe that access to accurate, timely environmental information is essential for building climate-resilient communities. EnviroSentinel Pro democratizes access to advanced environmental monitoring capabilities, empowering individuals, organizations, and governments to make informed decisions.
          </p>
          <p className="text-gray-700">
            By combining cutting-edge technology with community engagement, we're creating a future where everyone can understand and respond to environmental risks in their area.
          </p>
        </div>

        <div className="bg-emerald-600 text-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4">Furthering the Future</h2>
          <p className="mb-4">
            EnviroSentinel Pro is built on the principle that proactive environmental monitoring and risk assessment can save lives and protect communities. Our scenario planning features help visualize future climate impacts, enabling better long-term planning and adaptation strategies.
          </p>
          <p>
            Together, we can build a more resilient future for all.
          </p>
        </div>
      </div>
    </div>
  );
}
