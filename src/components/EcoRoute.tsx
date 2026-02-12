import { useState } from 'react';
import { Navigation, Car, TrendingDown, Leaf, DollarSign, Clock, MapPin, Route } from 'lucide-react';
import { ecoRouteService } from '../services/ecoRouteService';

interface RouteComparison {
  id: string;
  start_name: string;
  end_name: string;
  distance_km: number;
  duration_minutes: number;
  fastest_emissions_kg: number;
  greenest_emissions_kg: number;
  emission_savings_kg: number;
  fuel_cost_saved: number;
}

export function EcoRoute() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('car_gas');
  const [routeComparison, setRouteComparison] = useState<RouteComparison | null>(null);
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
    { value: 'car_gas', label: 'Gasoline Car', icon: '⛽' },
    { value: 'car_diesel', label: 'Diesel Car', icon: '🚗' },
    { value: 'car_hybrid', label: 'Hybrid Car', icon: '🔋' },
    { value: 'car_electric', label: 'Electric Car', icon: '⚡' },
    { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { value: 'truck', label: 'Truck', icon: '🚚' }
  ];

  const handleCalculate = async () => {
    if (!startLocation.trim() || !endLocation.trim()) {
      alert('Please enter both start and end locations');
      return;
    }

    setLoading(true);
    try {
      const result = await ecoRouteService.calculateRoute({
        startLocation: startLocation.trim(),
        endLocation: endLocation.trim(),
        vehicleType
      });
      setRouteComparison(result);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const co2ToTrees = (kg: number) => {
    return (kg / 21.77).toFixed(1);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">EcoRoute Planner</h1>
              <p className="text-slate-600">Find emission-optimized routes and reduce your carbon footprint</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Route Planning
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Starting Location
                </label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g., 123 Main St, San Francisco, CA"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  placeholder="e.g., 456 Oak Ave, San Jose, CA"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Car className="w-4 h-4 mr-1 text-green-600" />
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Calculate EcoRoute'}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <Leaf className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <p className="font-medium text-green-900 mb-1">How EcoRoute Works</p>
                    <p>We analyze traffic patterns, elevation changes, and road conditions to find the route with the lowest carbon emissions, not just the fastest one.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-blue-900 mb-1">💡 Did You Know?</p>
                  <p>Taking the greenest route can reduce your trip emissions by 15-30% compared to the fastest route, while often adding only 2-5 minutes of travel time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Route className="w-5 h-5 mr-2 text-green-600" />
              Route Comparison
            </h2>

            {!routeComparison ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <Navigation className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Enter your route details and click "Calculate" to compare emissions</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-600 p-2 rounded-full">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">Emissions Saved</div>
                        <div className="text-3xl font-bold text-green-700">{routeComparison.emission_savings_kg.toFixed(2)} kg</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">CO₂ Reduction</div>
                      <div className="text-lg font-bold text-green-600">{((routeComparison.emission_savings_kg / routeComparison.fastest_emissions_kg) * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 mb-2">⚡ Fastest Route</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-slate-500">Emissions</div>
                        <div className="text-lg font-bold text-slate-900">{routeComparison.fastest_emissions_kg.toFixed(2)} kg CO₂</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Time</div>
                        <div className="text-sm font-medium text-slate-700">{routeComparison.duration_minutes} min</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                    <div className="text-xs text-green-700 mb-2 font-medium">🌿 Greenest Route</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-green-600">Emissions</div>
                        <div className="text-lg font-bold text-green-800">{routeComparison.greenest_emissions_kg.toFixed(2)} kg CO₂</div>
                      </div>
                      <div>
                        <div className="text-xs text-green-600">Time</div>
                        <div className="text-sm font-medium text-green-700">{Math.round(routeComparison.duration_minutes * 1.05)} min</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Fuel Cost Saved</span>
                    </div>
                    <span className="text-lg font-bold text-blue-700">${routeComparison.fuel_cost_saved.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-slate-700">Distance</span>
                    </div>
                    <span className="text-lg font-bold text-amber-700">{routeComparison.distance_km.toFixed(1)} km</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-slate-700">Trees to Offset</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">{co2ToTrees(routeComparison.greenest_emissions_kg)} trees</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300">
                  <p className="text-sm text-green-900">
                    <strong>🎯 Impact:</strong> By choosing the greenest route, you'll prevent{' '}
                    <strong>{routeComparison.emission_savings_kg.toFixed(2)} kg</strong> of CO₂ from entering the atmosphere.
                    Over a year of daily commutes, that's <strong>{(routeComparison.emission_savings_kg * 250).toFixed(0)} kg</strong>!
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
