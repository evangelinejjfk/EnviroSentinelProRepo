import { useState, useEffect } from 'react';
import { CloudRain, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { dataIntegrationService } from '../services/dataIntegration';
import { FloodPrediction } from '../types';

export function FloodForecast() {
  const [prediction, setPrediction] = useState<FloodPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFloodData();
  }, []);

  const loadFloodData = async () => {
    setLoading(true);
    try {
      const data = await dataIntegrationService.fetchFloodForecast(37.7749, -122.4194);
      setPrediction(data);
    } catch (error) {
      console.error('Error loading flood forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (!prediction) return [];

    const data = [];
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;

    for (let i = -24; i <= prediction.timeToFlood; i += 3) {
      const progress = (i + 24) / (prediction.timeToFlood + 24);
      const level =
        prediction.currentLevel +
        (prediction.predictedLevel - prediction.currentLevel) * Math.min(progress, 1);

      data.push({
        time: i < 0 ? `${i}h` : `+${i}h`,
        level: parseFloat(level.toFixed(2)),
        threshold: prediction.threshold
      });
    }

    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading flood forecast data...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-600">No flood forecast data available</p>
      </div>
    );
  }

  const chartData = generateChartData();
  const riskLevel =
    prediction.predictedLevel > prediction.threshold
      ? 'High Risk'
      : prediction.predictedLevel > prediction.threshold * 0.85
      ? 'Moderate Risk'
      : 'Low Risk';

  const riskColor =
    riskLevel === 'High Risk' ? 'text-red-600' : riskLevel === 'Moderate Risk' ? 'text-orange-600' : 'text-green-600';

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Flood Forecast & Prediction</h2>
          <p className="text-slate-600">
            AI-powered flood prediction using real-time river data and weather forecasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-slate-500">Current</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{prediction.currentLevel.toFixed(2)}m</div>
            <div className="text-xs text-slate-600">Water Level</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-xs text-slate-500">Predicted</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{prediction.predictedLevel.toFixed(2)}m</div>
            <div className="text-xs text-slate-600">Peak Level</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span className="text-xs text-slate-500">Threshold</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{prediction.threshold.toFixed(2)}m</div>
            <div className="text-xs text-slate-600">Flood Level</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <CloudRain className="w-8 h-8 text-green-500" />
              <span className="text-xs text-slate-500">Time</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{prediction.timeToFlood}h</div>
            <div className="text-xs text-slate-600">To Peak Level</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Water Level Forecast</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Risk Level:</span>
              <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <ReferenceLine y={prediction.threshold} stroke="red" strokeDasharray="3 3" label="Flood Threshold" />
              <Line type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={2} name="Predicted Level" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">AI Model Insights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">Prediction Confidence</span>
                <span className="text-sm font-medium text-slate-700">{prediction.confidence.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-slate-900 mb-2">Forecast Summary</h4>
              <p className="text-sm text-slate-700">
                Based on current rainfall patterns and upstream river conditions, water levels at {prediction.location} are
                expected to rise from {prediction.currentLevel.toFixed(2)}m to {prediction.predictedLevel.toFixed(2)}m
                within the next {prediction.timeToFlood} hours.
                {prediction.predictedLevel > prediction.threshold
                  ? ' This exceeds the flood threshold and poses a significant risk to low-lying areas.'
                  : ' Levels remain below the flood threshold, indicating low immediate risk.'}
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-slate-900 mb-2">Recommended Actions</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                {prediction.predictedLevel > prediction.threshold ? (
                  <>
                    <li>• Evacuate low-lying areas within the next 12-24 hours</li>
                    <li>• Move valuable items to higher ground</li>
                    <li>• Prepare emergency supplies and evacuation routes</li>
                    <li>• Monitor updates every 2-3 hours</li>
                  </>
                ) : (
                  <>
                    <li>• Continue normal monitoring procedures</li>
                    <li>• Stay informed of weather forecasts</li>
                    <li>• Review evacuation plans as precaution</li>
                    <li>• Check back in 6-12 hours for updates</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
