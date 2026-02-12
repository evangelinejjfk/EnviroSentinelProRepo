import { useState, useEffect } from 'react';
import { Flame, Wind, Thermometer, AlertCircle, Satellite } from 'lucide-react';
import { MapView } from './MapView';
import { dataIntegrationService } from '../services/dataIntegration';
import { WildfireData } from '../types';

export function WildfireDetection() {
  const [wildfires, setWildfires] = useState<WildfireData[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadWildfireData();
    const interval = setInterval(loadWildfireData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadWildfireData = async () => {
    setLoading(true);
    try {
      const fires = await dataIntegrationService.fetchWildfireHotspots(49, 25, -66, -125);
      setWildfires(fires);

      const weather = await dataIntegrationService.fetchWeatherData(37.7749, -122.4194);
      setWeatherData(weather);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading wildfire data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeFireCount = wildfires.filter(f => f.confidence > 70).length;
  const avgConfidence = wildfires.length > 0
    ? wildfires.reduce((sum, f) => sum + f.confidence, 0) / wildfires.length
    : 0;

  const fireWeatherIndex = weatherData
    ? Math.min(100, (weatherData.temperature + weatherData.windSpeed * 2 - weatherData.humidity / 2))
    : 0;

  const getFireRisk = (index: number) => {
    if (index > 70) return { level: 'Extreme', color: 'text-red-600' };
    if (index > 50) return { level: 'High', color: 'text-orange-600' };
    if (index > 30) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  const risk = getFireRisk(fireWeatherIndex);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Wildfire Detection & Monitoring</h2>
          <p className="text-slate-600">
            Real-time wildfire detection using NASA FIRMS satellite data and AI classification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-xs text-slate-500">Detected</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{activeFireCount}</div>
            <div className="text-xs text-slate-600">Active Hotspots</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Satellite className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-slate-500">Confidence</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{avgConfidence.toFixed(0)}%</div>
            <div className="text-xs text-slate-600">Average AI Score</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <span className="text-xs text-slate-500">Fire Risk</span>
            </div>
            <div className={`text-2xl font-bold ${risk.color}`}>{risk.level}</div>
            <div className="text-xs text-slate-600">Current Conditions</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Wind className="w-8 h-8 text-green-500" />
              <span className="text-xs text-slate-500">Wind Speed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {weatherData?.windSpeed || 0} <span className="text-sm">mph</span>
            </div>
            <div className="text-xs text-slate-600">Current Wind</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Live Fire Detection Map</h3>
              <span className="text-xs text-slate-500">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="h-96">
              <MapView
                alerts={[]}
                wildfires={wildfires}
                center={[39.8283, -98.5795]}
                zoom={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Weather Conditions</h3>
              {weatherData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-slate-700">Temperature</span>
                    </div>
                    <span className="font-semibold">{weatherData.temperature}°C</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-slate-700">Wind Speed</span>
                    </div>
                    <span className="font-semibold">{weatherData.windSpeed} mph</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-700">💧 Humidity</span>
                    </div>
                    <span className="font-semibold">{weatherData.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-700">🧭 Wind Dir.</span>
                    </div>
                    <span className="font-semibold">{weatherData.windDirection}°</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Fire Weather Index</h3>
              <div className="mb-4">
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      fireWeatherIndex > 70
                        ? 'bg-red-600'
                        : fireWeatherIndex > 50
                        ? 'bg-orange-500'
                        : fireWeatherIndex > 30
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${fireWeatherIndex}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Extreme</span>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                Current fire weather conditions are rated as <strong className={risk.color}>{risk.level}</strong>.
                {fireWeatherIndex > 50
                  ? ' High temperatures, low humidity, and strong winds create favorable conditions for fire spread.'
                  : ' Conditions are relatively stable for fire containment operations.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Detections</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">ID</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">Location</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">Brightness</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">Confidence</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">Satellite</th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {wildfires.slice(0, 10).map((fire, index) => (
                  <tr key={fire.id} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-4 text-sm text-slate-700">#{index + 1}</td>
                    <td className="py-2 px-4 text-sm text-slate-700">
                      {fire.latitude.toFixed(3)}, {fire.longitude.toFixed(3)}
                    </td>
                    <td className="py-2 px-4 text-sm text-slate-700">{fire.brightness.toFixed(0)}K</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          fire.confidence > 80
                            ? 'bg-red-100 text-red-800'
                            : fire.confidence > 60
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {fire.confidence.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-slate-700">{fire.satellite}</td>
                    <td className="py-2 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
