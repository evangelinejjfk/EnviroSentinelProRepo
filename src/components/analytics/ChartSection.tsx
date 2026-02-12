import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import type { TrendPoint } from '../../services/analyticsService';

interface ChartSectionProps {
  trendData: TrendPoint[];
  byType: { type: string; count: number; color: string }[];
  bySeverity: { severity: string; count: number; color: string }[];
}

export function ChartSection({ trendData, byType, bySeverity }: ChartSectionProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Alert Activity Trends</h3>
        <p className="text-sm text-slate-500 mb-4">14-day environmental monitoring activity</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gFlood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFire" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPollution" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gHeat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="floods" name="Floods" stroke="#3b82f6" fill="url(#gFlood)" strokeWidth={2} />
              <Area type="monotone" dataKey="wildfires" name="Wildfires" stroke="#f97316" fill="url(#gFire)" strokeWidth={2} />
              <Area type="monotone" dataKey="pollution" name="Pollution" stroke="#06b6d4" fill="url(#gPollution)" strokeWidth={2} />
              <Area type="monotone" dataKey="heat" name="Heat" stroke="#ef4444" fill="url(#gHeat)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">By Category</h3>
          {byType.length > 0 ? (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {byType.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {byType.map((t) => (
              <div key={t.type} className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs text-slate-600">{t.type} ({t.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">By Severity</h3>
          {bySeverity.length > 0 ? (
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySeverity} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis dataKey="severity" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={70} />
                  <Tooltip />
                  <Bar dataKey="count" name="Alerts" radius={[0, 6, 6, 0]}>
                    {bySeverity.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
