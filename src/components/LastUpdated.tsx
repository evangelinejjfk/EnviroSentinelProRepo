import { Clock, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface LastUpdatedProps {
  timestamp?: Date | string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LastUpdated({ timestamp, onRefresh, isRefreshing = false }: LastUpdatedProps) {
  const [lastUpdate] = useState(timestamp || new Date());

  const displayTime = typeof lastUpdate === 'string' ? new Date(lastUpdate) : lastUpdate;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <span>Last updated {formatDistanceToNow(displayTime, { addSuffix: true })}</span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="ml-2 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}

export function GlobalRefresh({ onRefresh, isRefreshing = false }: { onRefresh: () => void; isRefreshing?: boolean }) {
  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium text-gray-900">
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </span>
    </button>
  );
}
