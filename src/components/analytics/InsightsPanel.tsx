import { AlertTriangle, CheckCircle, Info, AlertOctagon, Clock, Zap } from 'lucide-react';
import type { InsightItem, ActivityItem } from '../../services/analyticsService';

interface InsightsPanelProps {
  insights: InsightItem[];
  recentActivity: ActivityItem[];
}

const INSIGHT_STYLES: Record<string, { bg: string; border: string; icon: typeof AlertTriangle; iconColor: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertOctagon, iconColor: 'text-red-600' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-600' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-600' },
};

export function InsightsPanel({ insights, recentActivity }: InsightsPanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-5">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-900">AI-Powered Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const style = INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.info;
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-lg border ${style.bg} ${style.border} animate-fadeIn`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-slate-900">{insight.title}</h4>
                      {insight.metric && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.iconColor}`}>
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-2 mb-5">
          <Clock className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        </div>
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Clock className="w-10 h-10 mb-2" />
            <p className="text-sm">No activity recorded yet</p>
            <p className="text-xs mt-1">Use the modules to generate activity data</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors animate-fadeIn"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-700">{item.module.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-900">{item.action}</span>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                  <span className="text-xs text-emerald-600 font-medium">{item.module}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
