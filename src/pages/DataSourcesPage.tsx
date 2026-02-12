import { Database, Satellite, Gauge, Cloud, Users, AlertCircle } from 'lucide-react';

export default function DataSourcesPage() {
  const dataSources = [
    {
      module: 'Flood Forecasting',
      icon: Gauge,
      color: 'blue',
      sources: [
        { name: 'NOAA National Water Model', type: 'Real-time', frequency: '1 hour', status: 'Active' },
        { name: 'USGS Stream Gauges', type: 'Real-time', frequency: '15 minutes', status: 'Active' },
        { name: 'Historical Flood Data', type: 'Historical', frequency: 'Daily', status: 'Active' }
      ],
      methodology: 'Combines hydrological modeling with real-time gauge data to predict flood risk. Uses machine learning trained on historical flood events.'
    },
    {
      module: 'Wildfire Detection',
      icon: Satellite,
      color: 'orange',
      sources: [
        { name: 'NASA FIRMS (MODIS/VIIRS)', type: 'Satellite', frequency: '3 hours', status: 'Active' },
        { name: 'Weather Conditions (Wind, Humidity)', type: 'Real-time', frequency: '1 hour', status: 'Active' },
        { name: 'Vegetation Dryness Index', type: 'Satellite', frequency: 'Daily', status: 'Active' }
      ],
      methodology: 'Satellite thermal anomaly detection combined with weather conditions and vegetation analysis to identify and track wildfires.'
    },
    {
      module: 'Heat Island Detection',
      icon: Cloud,
      color: 'red',
      sources: [
        { name: 'Landsat 8 Thermal Imaging', type: 'Satellite', frequency: '16 days', status: 'Active' },
        { name: 'Weather Station Networks', type: 'Real-time', frequency: '1 hour', status: 'Active' },
        { name: 'Land Cover Classification', type: 'GIS Data', frequency: 'Annual', status: 'Active' }
      ],
      methodology: 'Combines thermal satellite imagery with land use data to identify urban heat islands and predict temperature variations.'
    },
    {
      module: 'Microplastic Risk',
      icon: Database,
      color: 'purple',
      sources: [
        { name: 'Water Quality Monitoring', type: 'Simulated', frequency: 'Demo', status: 'Simulated' },
        { name: 'Land Use Patterns', type: 'GIS Data', frequency: 'Annual', status: 'Active' },
        { name: 'Proximity to Pollution Sources', type: 'GIS Data', frequency: 'Updated', status: 'Active' }
      ],
      methodology: 'Risk model based on proximity to pollution sources, water body characteristics, and land use patterns. Currently using simulated data for demonstration.'
    },
    {
      module: 'Community Reports',
      icon: Users,
      color: 'green',
      sources: [
        { name: 'User-Submitted Reports', type: 'Crowdsourced', frequency: 'Real-time', status: 'Active' },
        { name: 'Photo Evidence', type: 'Crowdsourced', frequency: 'Real-time', status: 'Active' }
      ],
      methodology: 'Community-powered ground truth observations that complement and validate sensor-based detection systems.'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
      red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      green: { bg: 'bg-emerald-50', text: 'text-emerald-900', icon: 'text-emerald-600' }
    };
    return colors[color];
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Data Sources & Transparency</h1>
          <p className="text-lg text-gray-700">
            EnviroSentinel Pro integrates data from multiple authoritative sources to provide comprehensive environmental monitoring. Below is a detailed breakdown of our data sources, update frequencies, and methodologies.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 flex items-start">
          <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">Demo Data Notice</h3>
            <p className="text-yellow-800">
              Some features use simulated data for demonstration purposes. These are clearly marked as "Simulated" or "Demo" throughout the application. In production deployment, these would be replaced with real data sources.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {dataSources.map((module) => {
            const Icon = module.icon;
            const colors = getColorClasses(module.color);

            return (
              <div key={module.module} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`${colors.bg} p-6 border-b border-gray-200`}>
                  <div className="flex items-center">
                    <div className="bg-white rounded-full p-3 mr-4">
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h2 className={`text-2xl font-bold ${colors.text}`}>{module.module}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Data Sources</h3>
                  <div className="space-y-3 mb-6">
                    {module.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-900">{source.name}</div>
                          <div className="text-sm text-gray-600">
                            {source.type} • Updates every {source.frequency}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          source.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {source.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">Methodology</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {module.methodology}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-emerald-600 text-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4">Data Quality & Reliability</h2>
          <p className="mb-4">
            We prioritize data quality and transparency in all our operations. All predictions include confidence scores based on data availability, recency, and model validation against historical events.
          </p>
          <p>
            For questions about our data sources or methodologies, please contact our team through the Settings page.
          </p>
        </div>
      </div>
    </div>
  );
}
