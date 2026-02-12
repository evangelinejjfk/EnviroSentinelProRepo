import { Filter, X } from 'lucide-react';
import { useFilters, TimeWindow } from '../contexts/FilterContext';
import { AlertType, Severity } from '../types';
import { useState } from 'react';

export function FilterPanel() {
  const { filters, setCategories, setSeverities, setTimeWindow, clearFilters, hasActiveFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

  const categoryOptions: { value: AlertType; label: string }[] = [
    { value: 'flood', label: 'Floods' },
    { value: 'wildfire', label: 'Wildfires' },
    { value: 'heat_wave', label: 'Heat Waves' },
    { value: 'pollution', label: 'Pollution' }
  ];

  const severityOptions: { value: Severity; label: string }[] = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' }
  ];

  const timeWindowOptions: { value: TimeWindow; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '48h', label: 'Last 48 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const toggleCategory = (category: AlertType) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setCategories(newCategories);
  };

  const toggleSeverity = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter(s => s !== severity)
      : [...filters.severities, severity];
    setSeverities(newSeverities);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
      >
        <Filter className={`w-5 h-5 ${hasActiveFilters ? 'text-emerald-600' : 'text-gray-600'}`} />
        <span className="text-sm font-medium text-gray-900">Filters</span>
        {hasActiveFilters && (
          <span className="bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {filters.categories.length + filters.severities.length + (filters.timeWindow !== '7d' ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-xl z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Filter Options</h3>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearFilters();
                    setIsOpen(false);
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Category</h4>
                <div className="space-y-2">
                  {categoryOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(option.value)}
                        onChange={() => toggleCategory(option.value)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Severity</h4>
                <div className="space-y-2">
                  {severityOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.severities.includes(option.value)}
                        onChange={() => toggleSeverity(option.value)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Time Window</h4>
                <div className="space-y-2">
                  {timeWindowOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="timeWindow"
                        checked={filters.timeWindow === option.value}
                        onChange={() => setTimeWindow(option.value)}
                        className="border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium"
                    >
                      <span>{categoryOptions.find(o => o.value === cat)?.label}</span>
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="hover:bg-emerald-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.severities.map(sev => (
                    <span
                      key={sev}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      <span>{severityOptions.find(o => o.value === sev)?.label}</span>
                      <button
                        onClick={() => toggleSeverity(sev)}
                        className="hover:bg-blue-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
