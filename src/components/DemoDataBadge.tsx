import { AlertCircle } from 'lucide-react';

interface DemoDataBadgeProps {
  type?: 'inline' | 'banner';
  message?: string;
}

export function DemoDataBadge({ type = 'inline', message }: DemoDataBadgeProps) {
  if (type === 'banner') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-yellow-900 text-sm">Demo Data</div>
          <div className="text-xs text-yellow-800">
            {message || 'This module is using simulated data for demonstration purposes. In production, this would connect to real data sources.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
      <AlertCircle className="w-3 h-3" />
      <span>Demo Data</span>
    </span>
  );
}
