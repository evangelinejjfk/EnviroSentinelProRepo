import { TrendingUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
  showExplanation?: boolean;
}

export function ConfidenceIndicator({ confidence, showExplanation = false }: ConfidenceIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return { bg: 'bg-green-500', text: 'text-green-700', label: 'High' };
    if (conf >= 60) return { bg: 'bg-blue-500', text: 'text-blue-700', label: 'Moderate' };
    if (conf >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Fair' };
    return { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Low' };
  };

  const colors = getConfidenceColor(confidence);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <TrendingUp className={`w-4 h-4 ${colors.text}`} />
          <span className={`font-semibold ${colors.text}`}>{confidence.toFixed(0)}%</span>
          <span className="text-sm text-gray-600">Confidence</span>
        </div>

        {showExplanation && (
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colors.bg} transition-all duration-500`}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {showTooltip && (
        <div className="absolute z-50 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg p-3 w-64 shadow-xl">
          <div className="font-semibold mb-2">Confidence: {colors.label}</div>
          <div className="space-y-1 text-gray-300">
            <div>Based on:</div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Data quality and recency</li>
              <li>Model validation accuracy</li>
              <li>Historical performance</li>
              <li>Data source reliability</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
