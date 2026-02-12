import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export default function RiskCorrelationsPage() {
  const { location } = useLocation();

  const correlations = [
    {
      title: 'Wildfire → Air Quality',
      risks: ['wildfire', 'pollution'],
      severity: 'high',
      description: 'Wildfire smoke significantly degrades air quality, creating hazardous conditions that can extend hundreds of miles downwind.',
      impacts: [
        'Respiratory health risks increase dramatically',
        'Visibility reduced, affecting transportation',
        'Particulate matter (PM2.5) can reach hazardous levels',
        'Effects persist for days after fire containment'
      ],
      locations: 'Particularly relevant in Western states during fire season'
    },
    {
      title: 'Heat + Drought → Wildfire',
      risks: ['heat_wave', 'wildfire'],
      severity: 'critical',
      description: 'Extended heat waves combined with drought create ideal conditions for rapid wildfire spread and intensification.',
      impacts: [
        'Vegetation dries out, becoming fuel',
        'Lower humidity reduces natural fire suppression',
        'Higher temperatures increase ignition probability',
        'Wind patterns may become more extreme'
      ],
      locations: 'Critical risk in California, Arizona, and other arid regions'
    },
    {
      title: 'Heavy Rain After Wildfire → Flooding/Mudslides',
      risks: ['wildfire', 'flood'],
      severity: 'high',
      description: 'Burned areas lose soil stability and vegetation that normally absorbs water, creating extreme flood and mudslide risk.',
      impacts: [
        'Soil becomes hydrophobic after fires',
        'No vegetation to slow runoff',
        'Debris flows can occur with minimal rainfall',
        'Infrastructure damage can be severe'
      ],
      locations: 'Post-fire burn scars in mountainous areas'
    },
    {
      title: 'Heat Island + Heat Wave → Public Health Crisis',
      risks: ['heat_wave'],
      severity: 'high',
      description: 'Urban heat islands amplify the effects of regional heat waves, creating dangerously high temperatures in cities.',
      impacts: [
        'Vulnerable populations at extreme risk',
        'Nighttime temperatures remain elevated',
        'Increased energy demand strains infrastructure',
        'Heat-related illness and mortality increase'
      ],
      locations: 'Major metropolitan areas with limited green space'
    },
    {
      title: 'Coastal Flooding + Storm Surge → Infrastructure Damage',
      risks: ['flood'],
      severity: 'moderate',
      description: 'Sea level rise combined with storm events creates compound flooding risk in coastal communities.',
      impacts: [
        'Multiple flooding pathways converge',
        'Drainage systems overwhelmed',
        'Saltwater intrusion into freshwater',
        'Critical infrastructure at risk'
      ],
      locations: 'Coastal cities and low-lying areas'
    }
  ];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      critical: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200' },
      high: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200' },
      moderate: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' }
    };
    return colors[severity] || colors.moderate;
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Cross-Risk Insights</h1>
          <p className="text-lg text-gray-700 mb-4">
            Environmental risks don't occur in isolation. Understanding how different hazards interact and compound each other is critical for comprehensive risk assessment and planning.
          </p>
          {location && (
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-900">
                Analysis for: {location.displayName}
              </p>
              <p className="text-sm text-emerald-700">
                {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 flex items-start">
          <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Why Cross-Risk Analysis Matters</h3>
            <p className="text-blue-800">
              Compound and cascading risks can create impacts far greater than individual hazards. By understanding these interactions, communities can develop more effective adaptation and resilience strategies.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {correlations.map((correlation, idx) => {
            const colors = getSeverityColor(correlation.severity);

            return (
              <div key={idx} className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${colors.border}`}>
                <div className={`${colors.bg} p-6 border-b border-gray-200`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
                        {correlation.title}
                      </h2>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {correlation.severity.charAt(0).toUpperCase() + correlation.severity.slice(1)} Risk
                      </span>
                    </div>
                    <TrendingUp className={`w-6 h-6 ${colors.text}`} />
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {correlation.description}
                  </p>

                  <h3 className="font-bold text-gray-900 mb-3">Compound Impacts</h3>
                  <ul className="space-y-2 mb-6">
                    {correlation.impacts.map((impact, impactIdx) => (
                      <li key={impactIdx} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{impact}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Geographic Relevance</h4>
                    <p className="text-gray-700">{correlation.locations}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4">Building Resilience Through Understanding</h2>
          <p className="mb-4">
            By recognizing how environmental risks interact and amplify each other, we can develop more comprehensive adaptation strategies. EnviroSentinel Pro monitors these correlations in real-time, providing early warning when compound risk conditions develop.
          </p>
          <p className="text-emerald-100">
            Use this information to inform emergency preparedness plans, infrastructure investment decisions, and community resilience programs.
          </p>
        </div>
      </div>
    </div>
  );
}
