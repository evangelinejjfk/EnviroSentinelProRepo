import { useState, useEffect } from 'react';
import {
  BarChart3, AlertTriangle, Leaf, Thermometer, Droplets, Navigation,
  RefreshCw, Activity, TreePine, Fuel, Shield,
} from 'lucide-react';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { HealthGauge } from './analytics/HealthGauge';
import { ChartSection } from './analytics/ChartSection';
import { InsightsPanel } from './analytics/InsightsPanel';

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getAnalyticsData();
      setData(result);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Aggregating environmental data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Environmental Analytics</h1>
              <p className="text-slate-500">Cross-domain environmental intelligence and impact analysis</p>
            </div>
          </div>
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex items-center justify-center">
            <HealthGauge value={data.healthIndex} trend={data.healthTrend} />
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<AlertTriangle className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-red-500 to-orange-500"
              label="Active Alerts"
              value={data.alertStats.total}
              sub={`${data.alertStats.criticalCount} critical`}
              subColor="text-red-600"
            />
            <MetricCard
              icon={<Leaf className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
              label="CO₂ Prevented"
              value={`${data.carbonStats.totalSavedKg.toFixed(1)}kg`}
              sub={`${data.carbonStats.routeCount} routes`}
              subColor="text-emerald-600"
            />
            <MetricCard
              icon={<Thermometer className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-orange-500 to-red-500"
              label="Heat Assessments"
              value={data.heatStats.assessmentCount}
              sub={`${data.heatStats.highRiskCount} high risk`}
              subColor="text-orange-600"
            />
            <MetricCard
              icon={<Droplets className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-cyan-500 to-blue-500"
              label="Pollution Checks"
              value={data.pollutionStats.assessmentCount}
              sub={`${data.pollutionStats.highRiskCount} high risk`}
              subColor="text-blue-600"
            />

            <MetricCard
              icon={<Shield className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
              label="Modules Active"
              value={5}
              sub="All operational"
              subColor="text-emerald-600"
            />
            <MetricCard
              icon={<Navigation className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
              label="Fuel Saved"
              value={`$${data.carbonStats.totalFuelSaved.toFixed(2)}`}
              sub={`${data.carbonStats.totalDistanceKm.toFixed(0)}km tracked`}
              subColor="text-green-600"
            />
            <MetricCard
              icon={<TreePine className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-green-600 to-emerald-700"
              label="Trees Recommended"
              value={data.heatStats.totalTreesRecommended}
              sub="Urban cooling"
              subColor="text-green-700"
            />
            <MetricCard
              icon={<Fuel className="w-5 h-5" />}
              iconBg="bg-gradient-to-br from-teal-500 to-cyan-600"
              label="Avg Risk Score"
              value={data.pollutionStats.avgRiskScore > 0 ? `${data.pollutionStats.avgRiskScore.toFixed(0)}/100` : 'N/A'}
              sub="Microplastic index"
              subColor="text-teal-600"
            />
          </div>
        </div>

        <ChartSection
          trendData={data.trendData}
          byType={data.alertStats.byType}
          bySeverity={data.alertStats.bySeverity}
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <ModuleCard
            name="Flood Forecast"
            description="AI-powered water level prediction"
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-blue-500 to-cyan-600"
            stat={`${data.alertStats.byType.find(t => t.type === 'Floods')?.count || 0} alerts`}
          />
          <ModuleCard
            name="Wildfire Detection"
            description="NASA FIRMS satellite monitoring"
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-orange-500 to-red-600"
            stat={`${data.alertStats.byType.find(t => t.type === 'Wildfires')?.count || 0} alerts`}
          />
          <ModuleCard
            name="Microplastic Mapper"
            description="Water pollution risk analysis"
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-cyan-500 to-blue-600"
            stat={`${data.pollutionStats.assessmentCount} assessed`}
          />
          <ModuleCard
            name="Heat Island Predictor"
            description="Urban heat vulnerability mapping"
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-red-500 to-orange-600"
            stat={`${data.heatStats.assessmentCount} assessed`}
          />
          <ModuleCard
            name="EcoRoute Planner"
            description="Emission-optimized navigation"
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-green-500 to-emerald-600"
            stat={`${data.carbonStats.routeCount} routes`}
          />
        </div>

        <InsightsPanel insights={data.insights} recentActivity={data.recentActivity} />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  subColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  sub: string;
  subColor: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-shadow">
      <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center text-white mb-3 shadow-sm`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 leading-tight">{value}</div>
      <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
      <div className={`text-xs font-semibold mt-1 ${subColor}`}>{sub}</div>
    </div>
  );
}

function ModuleCard({
  name,
  description,
  icon,
  gradient,
  stat,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  stat: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-all group">
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-sm font-bold text-slate-900">{name}</h4>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      <div className="mt-2 flex items-center space-x-1.5">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-slate-600">{stat}</span>
      </div>
    </div>
  );
}
