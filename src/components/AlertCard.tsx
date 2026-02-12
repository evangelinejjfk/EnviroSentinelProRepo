import { CloudRain, Flame, Droplets, Thermometer, MapPin, Clock, TrendingUp, Map, Eye, Shield, Share2, Database } from 'lucide-react';
import { Alert } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

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
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}?alert=${alert.id}`;
    navigator.clipboard.writeText(url);
    alert('Alert link copied to clipboard!');
  };

  const dataSource = alert.metadata?.source || 'Multi-source';
  const detectionTime = formatDistanceToNow(new Date(alert.created_at), { addSuffix: true });

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-lg ${
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

      <div className="space-y-1 text-xs mb-3">
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

        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Source: {dataSource} • Detected {detectionTime}</span>
        </div>
      </div>

      {(showActions || showDetails) && (
        <div className="flex items-center space-x-2 pt-3 border-t border-gray-300">
          <button
            onClick={handleViewOnMap}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded text-xs font-medium transition-colors"
          >
            <Map className="w-3 h-3" />
            <span>View on Map</span>
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded text-xs font-medium transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </button>

          <button
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded text-xs font-medium transition-colors"
          >
            <Shield className="w-3 h-3" />
            <span>Safety</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/50 hover:bg-white rounded text-xs font-medium transition-colors"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
        </div>
      )}

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-300 text-xs space-y-2">
          <div>
            <span className="font-semibold">Alert ID:</span> {alert.id.slice(0, 8)}...
          </div>
          <div>
            <span className="font-semibold">Status:</span> {alert.status}
          </div>
          <div>
            <span className="font-semibold">Created:</span> {new Date(alert.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
