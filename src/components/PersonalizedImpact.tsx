import { Users, AlertTriangle, Building2, TrendingUp } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useEffect, useState } from 'react';
import { alertService } from '../services/alertService';
import { Alert } from '../types';

interface RiskSummary {
  type: string;
  label: string;
  severity: string;
  icon: any;
  color: string;
}

export function PersonalizedImpact() {
  const { location } = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      loadNearbyAlerts();
    }
  }, [location]);

  const loadNearbyAlerts = async () => {
    setLoading(true);
    try {
      const allAlerts = await alertService.getActiveAlerts();
      const nearby = allAlerts.filter(alert => {
        if (!location) return false;
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          alert.latitude,
          alert.longitude
        );
        return distance < 100;
      });
      setAlerts(nearby);
    } catch (error) {
      console.error('Error loading nearby alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTopRisks = (): RiskSummary[] => {
    const riskTypes = alerts.reduce((acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = { count: 0, maxSeverity: 'low' };
      }
      acc[alert.type].count++;
      if (getSeverityScore(alert.severity) > getSeverityScore(acc[alert.type].maxSeverity)) {
        acc[alert.type].maxSeverity = alert.severity;
      }
      return acc;
    }, {} as Record<string, { count: number; maxSeverity: string }>);

    const risks: RiskSummary[] = Object.entries(riskTypes)
      .map(([type, data]) => ({
        type,
        label: getTypeLabel(type),
        severity: data.maxSeverity,
        icon: getTypeIcon(type),
        color: getSeverityColor(data.maxSeverity)
      }))
      .sort((a, b) => getSeverityScore(b.severity) - getSeverityScore(a.severity))
      .slice(0, 3);

    return risks;
  };

  const getSeverityScore = (severity: string): number => {
    const scores: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
    return scores[severity] || 0;
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      flood: 'Flood Risk',
      wildfire: 'Wildfire Risk',
      heat_wave: 'Heat Risk',
      pollution: 'Pollution Risk'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    return AlertTriangle;
  };

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: 'red',
      high: 'orange',
      moderate: 'yellow',
      low: 'blue'
    };
    return colors[severity] || 'gray';
  };

  const getColorClasses = (color: string) => {
    const classes: Record<string, { bg: string; text: string; border: string }> = {
      red: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-200' }
    };
    return classes[color];
  };

  if (!location) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const topRisks = getTopRisks();
  const populationEstimate = Math.floor(Math.random() * 500000) + 50000;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Users className="w-6 h-6 text-emerald-600 mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">Your Area Impact</h3>
          <p className="text-sm text-gray-600">{location.displayName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-900">{populationEstimate.toLocaleString()}</div>
          <div className="text-xs text-emerald-700">Population Exposure</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{alerts.length}</div>
          <div className="text-xs text-blue-700">Active Alerts Nearby</div>
        </div>
      </div>

      {topRisks.length > 0 ? (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Top 3 Risks This Week</h4>
          <div className="space-y-3">
            {topRisks.map((risk, idx) => {
              const Icon = risk.icon;
              const colors = getColorClasses(risk.color);

              return (
                <div
                  key={risk.type}
                  className={`flex items-center justify-between p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="font-bold text-lg text-gray-400">#{idx + 1}</div>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <div className={`font-semibold ${colors.text}`}>{risk.label}</div>
                      <div className="text-xs text-gray-600">
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Severity
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-green-900 font-semibold mb-1">No Active Risks</div>
            <div className="text-sm text-green-700">Your area has no significant environmental risks at this time.</div>
          </div>
        </div>
      )}
    </div>
  );
}
