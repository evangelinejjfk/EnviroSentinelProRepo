import { Info, Database, Cpu, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface HowItWorksProps {
  title: string;
  inputs: string[];
  model: string;
  dataSources: string[];
  updateFrequency: string;
}

export function HowItWorks({ title, inputs, model, dataSources, updateFrequency }: HowItWorksProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">How It Works: {title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-blue-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900 text-sm">Inputs Used</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 ml-6">
              {inputs.map((input, idx) => (
                <li key={idx}>{input}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900 text-sm">Model Approach</h4>
            </div>
            <p className="text-sm text-blue-800">{model}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900 text-sm">Data Sources</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 ml-6">
              {dataSources.map((source, idx) => (
                <li key={idx}>{source}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <span className="text-xs font-semibold text-blue-900">Update Frequency: </span>
            <span className="text-xs text-blue-700">{updateFrequency}</span>
          </div>
        </div>
      )}
    </div>
  );
}
