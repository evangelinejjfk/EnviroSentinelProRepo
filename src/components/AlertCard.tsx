import { CloudRain, Flame, Droplets, Thermometer, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Alert } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

const alertIcons = {
  flood: CloudRain,
  wildfire: Flame,
  pollution: Droplets,
  heat_wave: Thermometer
};

export function AlertCard({ alert, onClick }: AlertCardProps) {
  const severityColors = {
    critical: 'bg-red-100 border-red-500 text-red-900',
    high: 'bg-orange-100 border-orange-500 text-orange-900',
    moderate: 'bg-yellow-100 border-yellow-500 text-yellow-900',
    low: 'bg-blue-100 border-blue-500 text-blue-900'
  };

  const severityBadgeColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    moderate: 'bg-yellow-500 text-white',
    low: 'bg-blue-500 text-white'
  };

  const Icon = alertIcons[alert.type] || Flame;

  return (
    <div
      onClick={onClick}
      className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
        severityColors[alert.severity]
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <h3 className="font-bold text-lg">{alert.title}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            severityBadgeColors[alert.severity]
          }`}
        >
          {alert.severity.toUpperCase()}
        </span>
      </div>

      <p className="text-sm mb-3">{alert.description}</p>

      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{alert.location_name}</span>
        </div>

        {alert.predicted_time && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              Expected: {formatDistanceToNow(new Date(alert.predicted_time), { addSuffix: true })}
            </span>
          </div>
        )}

        {alert.confidence && (
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Confidence: {alert.confidence.toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
