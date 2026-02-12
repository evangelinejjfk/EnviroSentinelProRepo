import { useState } from 'react';
import { Thermometer, TreePine, Building, AlertCircle, MapPin, TrendingUp } from 'lucide-react';
import { heatIslandService } from '../services/heatIslandService';

interface HeatAssessment {
  id: string;
  location_name: string;
  heat_vulnerability_score: number;
  risk_level: string;
  surface_temp_celsius: number;
  projected_temp_increase: number;
  tree_recommendations: TreeRecommendation[];
}

interface TreeRecommendation {
  id: string;
  priority_score: number;
  recommended_trees: number;
  projected_temp_reduction: number;
  tree_species: string[];
  cooling_benefit: string;
}

export function HeatIslandPredictor() {
  const [locationName, setLocationName] = useState('');
  const [treeCover, setTreeCover] = useState('20');
  const [buildingDensity, setBuildingDensity] = useState('500');
  const [surfaceTemp, setSurfaceTemp] = useState('35');
  const [assessment, setAssessment] = useState<HeatAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!locationName.trim()) {
      alert('Please enter a location name');
      return;
    }

    setLoading(true);
    try {
      const result = await heatIslandService.assessHeatVulnerability({
        locationName: locationName.trim(),
        treeCoverPercent: parseFloat(treeCover),
        buildingDensity: parseFloat(buildingDensity),
        surfaceTempCelsius: parseFloat(surfaceTemp)
      });
      setAssessment(result);
    } catch (error) {
      console.error('Error analyzing heat vulnerability:', error);
      alert('Failed to analyze heat vulnerability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'moderate': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-50 border-red-300';
      case 'high': return 'bg-orange-50 border-orange-300';
      case 'moderate': return 'bg-yellow-50 border-yellow-300';
      case 'low': return 'bg-green-50 border-green-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-3 rounded-xl shadow-lg">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Urban Heat Island Predictor</h1>
              <p className="text-slate-600">Analyze heat vulnerability and optimize tree placement</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Neighborhood Analysis
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Neighborhood Name
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g., Downtown Phoenix, AZ"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <TreePine className="w-4 h-4 mr-1 text-green-600" />
                  Tree Cover Percentage
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={treeCover}
                  onChange={(e) => setTreeCover(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>No Trees (0%)</span>
                  <span className="font-bold text-red-600">{treeCover}%</span>
                  <span>Full Canopy (100%)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-1 text-slate-600" />
                  Building Density (buildings/km²)
                </label>
                <input
                  type="number"
                  value={buildingDensity}
                  onChange={(e) => setBuildingDensity(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Low: &lt;200, Medium: 200-800, High: 800+</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Surface Temperature (°C)
                </label>
                <input
                  type="number"
                  value={surfaceTemp}
                  onChange={(e) => setSurfaceTemp(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Typical range: 25-45°C (77-113°F)</p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Heat Vulnerability'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-red-900 mb-1">Climate Adaptation Tool</p>
                  <p>Our model predicts heat vulnerability based on tree coverage, building density, and surface materials. Get actionable recommendations for urban cooling strategies.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
              Vulnerability Assessment
            </h2>

            {!assessment ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Thermometer className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Enter neighborhood data and click "Analyze" to see heat vulnerability results</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-6 rounded-xl border-2 ${getRiskBgColor(assessment.risk_level)}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-slate-700 mb-2">{assessment.location_name}</h3>
                    <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-bold bg-gradient-to-r ${getRiskColor(assessment.risk_level)}`}>
                      {assessment.risk_level.toUpperCase()} RISK
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-900 mb-1">{assessment.heat_vulnerability_score}</div>
                    <div className="text-sm text-slate-600">Vulnerability Score (0-100)</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <div className="text-xs text-slate-600 mb-1">Surface Temp</div>
                    <div className="text-2xl font-bold text-red-700">{assessment.surface_temp_celsius}°C</div>
                    <div className="text-xs text-slate-500">{(assessment.surface_temp_celsius * 9/5 + 32).toFixed(0)}°F</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                    <div className="text-xs text-slate-600 mb-1">Projected Increase</div>
                    <div className="text-2xl font-bold text-amber-700">+{assessment.projected_temp_increase}°C</div>
                    <div className="text-xs text-slate-500">by 2050</div>
                  </div>
                </div>

                {assessment.tree_recommendations && assessment.tree_recommendations.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                      <TreePine className="w-5 h-5 mr-2 text-green-600" />
                      Tree Planting Strategy
                    </h3>

                    {assessment.tree_recommendations.map((rec, index) => (
                      <div key={rec.id} className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-green-900">Priority Zone {index + 1}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-green-700">Priority Score:</span>
                              <span className="text-sm font-bold text-green-800">{rec.priority_score}/100</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-700">{rec.recommended_trees}</div>
                            <div className="text-xs text-green-600">trees</div>
                          </div>
                        </div>

                        <div className="mt-2 p-2 bg-white rounded border border-green-100">
                          <div className="text-xs text-slate-600 mb-1">Expected Cooling</div>
                          <div className="text-lg font-bold text-green-700">-{rec.projected_temp_reduction}°C</div>
                        </div>

                        <div className="mt-2">
                          <div className="text-xs text-slate-600 mb-1">Recommended Species:</div>
                          <div className="flex flex-wrap gap-1">
                            {rec.tree_species.map((species, idx) => (
                              <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {species}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 mt-2 italic">{rec.cooling_benefit}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Action Item:</strong> Share these recommendations with city planners, urban forestry departments, and community organizations to implement cooling strategies.
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
