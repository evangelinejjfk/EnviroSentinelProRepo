import { useState } from 'react';
import { Droplets, AlertTriangle, TrendingUp, Info, MapPin } from 'lucide-react';
import { microplasticService } from '../services/microplasticService';

interface Assessment {
  id: string;
  location_name: string;
  risk_score: number;
  risk_level: string;
  predicted_concentration: number;
  recommendations: string[];
}

export function MicroplasticMapper() {
  const [locationName, setLocationName] = useState('');
  const [populationDensity, setPopulationDensity] = useState('1000');
  const [industrialProximity, setIndustrialProximity] = useState('5');
  const [wasteInfrastructure, setWasteInfrastructure] = useState('50');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAssess = async () => {
    if (!locationName.trim()) {
      alert('Please enter a location name');
      return;
    }

    setLoading(true);
    try {
      const result = await microplasticService.assessPollutionRisk({
        locationName: locationName.trim(),
        populationDensity: parseFloat(populationDensity),
        industrialProximityKm: parseFloat(industrialProximity),
        wasteInfrastructureScore: parseFloat(wasteInfrastructure)
      });
      setAssessment(result);
    } catch (error) {
      console.error('Error assessing pollution risk:', error);
      alert('Failed to assess pollution risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-300';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      case 'low': return 'text-green-600 bg-green-50 border-green-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'moderate': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Microplastic Mapper</h1>
              <p className="text-slate-600">Assess water pollution risk in local communities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-cyan-600" />
              Assessment Parameters
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location Name
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g., Lake Michigan, Chicago"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Population Density (people/km²)
                </label>
                <input
                  type="number"
                  value={populationDensity}
                  onChange={(e) => setPopulationDensity(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Urban: 3000+, Suburban: 1000-3000, Rural: &lt;1000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industrial Proximity (km)
                </label>
                <input
                  type="number"
                  value={industrialProximity}
                  onChange={(e) => setIndustrialProximity(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Distance to nearest industrial facility</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Waste Infrastructure Score (0-100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wasteInfrastructure}
                  onChange={(e) => setWasteInfrastructure(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>Poor (0)</span>
                  <span className="font-bold text-cyan-600">{wasteInfrastructure}</span>
                  <span>Excellent (100)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Quality of local waste management systems</p>
              </div>

              <button
                onClick={handleAssess}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Assess Pollution Risk'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-cyan-900 mb-1">How it works:</p>
                  <p>Our AI analyzes multiple factors including population density, industrial activity, and waste management quality to predict microplastic contamination risk in water bodies.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-cyan-600" />
              Risk Assessment
            </h2>

            {!assessment ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Droplets className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Enter parameters and click "Assess Pollution Risk" to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${getRiskColor(assessment.risk_level)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Risk Level</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getRiskBadgeColor(assessment.risk_level)}`}>
                      {assessment.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{assessment.location_name}</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">{assessment.risk_score}</span>
                    <span className="text-sm opacity-75">/ 100</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Predicted Concentration</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {assessment.predicted_concentration.toFixed(1)} <span className="text-base font-normal text-slate-600">particles/L</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {assessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                        <span className="w-5 h-5 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cyan-700 font-bold text-xs">{index + 1}</span>
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Community Action:</strong> Share this assessment with local authorities and environmental groups to drive positive change in your area.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
