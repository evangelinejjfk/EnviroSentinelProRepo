import { useState, useEffect } from 'react';
import { MapView } from './MapView';
import { AlertCard } from './AlertCard';
import { Alert, WildfireData } from '../types';
import { alertService } from '../services/alertService';
import { dataIntegrationService } from '../services/dataIntegration';
import { communityReportService, CommunityReport } from '../services/communityReportService';
import { RefreshCw, CloudRain, Flame, Droplets, Thermometer, Navigation, TrendingUp, Globe2 } from 'lucide-react';

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

export function Dashboard({ onViewChange }: DashboardProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [wildfires, setWildfires] = useState<WildfireData[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [alertsData, wildfiresData, reportsData] = await Promise.all([
        alertService.getActiveAlerts(),
        dataIntegrationService.fetchWildfireHotspots(49, 25, -66, -125),
        communityReportService.getReports({ limit: 50 })
      ]);

      setAlerts(alertsData);
      setWildfires(wildfiresData);
      setCommunityReports(reportsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading climate data...</p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      id: 'floods',
      name: 'Flood Forecast',
      description: 'Real-time flood prediction and risk assessment',
      icon: CloudRain,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      alerts: alerts.filter(a => a.type === 'flood').length
    },
    {
      id: 'wildfires',
      name: 'Wildfire Detection',
      description: 'Satellite-based fire monitoring and smoke tracking',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      alerts: alerts.filter(a => a.type === 'wildfire').length
    },
    {
      id: 'microplastic',
      name: 'Microplastic Mapper',
      description: 'Water pollution risk assessment tool',
      icon: Droplets,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      alerts: alerts.filter(a => a.type === 'pollution').length
    },
    {
      id: 'heat-island',
      name: 'Heat Island Predictor',
      description: 'Urban heat vulnerability and cooling strategies',
      icon: Thermometer,
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      alerts: alerts.filter(a => a.type === 'heat_wave').length
    },
    {
      id: 'eco-route',
      name: 'EcoRoute Planner',
      description: 'Emission-optimized navigation and carbon reduction',
      icon: Navigation,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      alerts: 0
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Environmental Intelligence Hub</h1>
                <p className="text-slate-600">Comprehensive monitoring across five critical domains</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Total Alerts</div>
                  <div className="text-3xl font-bold text-slate-900">{alerts.length}</div>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Wildfire Hotspots</div>
                  <div className="text-3xl font-bold text-orange-600">{wildfires.length}</div>
                </div>
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Active Modules</div>
                  <div className="text-3xl font-bold text-emerald-600">5</div>
                </div>
                <Globe2 className="w-8 h-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 mb-1">System Status</div>
                  <div className="text-lg font-bold text-green-600">Operational</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => onViewChange?.(module.id)}
                className={`bg-white rounded-xl shadow-lg border-2 ${module.borderColor} p-6 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-br ${module.color} p-3 rounded-xl shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{module.name}</h3>
                      <p className="text-sm text-slate-600">{module.description}</p>
                    </div>
                  </div>
                  {module.alerts > 0 && (
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${module.color}`}>
                      {module.alerts} Alert{module.alerts !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
              <h3 className="text-lg font-bold text-slate-900">Live Climate Monitor</h3>
            </div>
            <div className="h-[500px]">
              <MapView
                alerts={alerts}
                wildfires={wildfires}
                communityReports={communityReports}
                onAlertClick={setSelectedAlert}
                center={[39.8283, -98.5795]}
                zoom={4}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Active Alerts</h3>

            {selectedAlert && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-900">Selected</h4>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
                <AlertCard alert={selectedAlert} />
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p>No active alerts</p>
                  <p className="text-sm mt-2">All systems normal</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onClick={() => setSelectedAlert(alert)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
