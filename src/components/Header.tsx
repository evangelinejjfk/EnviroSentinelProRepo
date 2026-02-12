import { useState, useEffect, useRef } from 'react';
import { Globe2, CloudRain, Flame, Droplets, Thermometer, Play, Calendar, X, ChevronDown } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { useDemo, DemoScenario } from '../contexts/DemoContext';
import { useScenario, ScenarioYear } from '../contexts/ScenarioContext';
import { useTutorial } from '../contexts/TutorialContext';

interface HeaderProps {
  activeAlerts: number;
  floodAlerts: number;
  wildfireAlerts: number;
  pollutionAlerts?: number;
  heatAlerts?: number;
}

export function Header({ floodAlerts, wildfireAlerts, pollutionAlerts = 0, heatAlerts = 0 }: HeaderProps) {
  const { isDemoMode, activeScenario, loadScenario, exitDemoMode } = useDemo();
  const { scenario, setScenario } = useScenario();
  const { restartTutorial } = useTutorial();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDemoMenu(false);
      }
    };

    if (showDemoMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDemoMenu]);

  const demoOptions: { id: DemoScenario; label: string; description: string }[] = [
    { id: 'sacramento-flood', label: 'Sacramento Flood', description: 'Flood warning scenario' },
    { id: 'california-wildfire', label: 'California Wildfire', description: 'Wildfire detection scenario' },
    { id: 'phoenix-heatwave', label: 'Phoenix Heat Wave', description: 'Extreme heat scenario' }
  ];

  const handleScenarioSelect = (scenarioId: DemoScenario) => {
    loadScenario(scenarioId);
    setShowDemoMenu(false);
  };

  const handleExitDemo = () => {
    exitDemoMode();
    setShowDemoMenu(false);
  };

  const handleRestartTutorial = () => {
    restartTutorial();
    setShowDemoMenu(false);
  };

  const scenarios: { value: ScenarioYear; label: string }[] = [
    { value: 'now', label: 'Now' },
    { value: '2030', label: '2030' },
    { value: '2050', label: '2050' }
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg shadow-lg">
              <Globe2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EnviroSentinel Pro</h1>
              <p className="text-sm text-emerald-200">Advanced Environmental Monitoring</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div data-tutorial="scenario-selector" className="hidden lg:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
              <Calendar className="w-4 h-4 text-emerald-300" />
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioYear)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {scenarios.map((s) => (
                  <option key={s.value} value={s.value} className="bg-emerald-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                  isDemoMode
                    ? 'bg-orange-500/20 border-orange-300/50 text-orange-200'
                    : 'bg-white/10 border-white/20 text-emerald-200 hover:bg-white/20'
                }`}
              >
                <Play className={`w-4 h-4 ${isDemoMode ? 'text-orange-300' : 'text-emerald-300'}`} />
                <span className="text-sm font-semibold">
                  {isDemoMode ? 'Demo Active' : 'Try Demo'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDemoMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <h3 className="font-semibold">Demo Scenarios</h3>
                    <p className="text-xs text-emerald-100 mt-1">Explore with sample environmental data</p>
                  </div>

                  <div className="p-2">
                    {demoOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleScenarioSelect(option.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          activeScenario === option.id
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 p-2 space-y-1">
                    <button
                      onClick={handleRestartTutorial}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 text-sm font-medium"
                    >
                      Restart Tutorial
                    </button>

                    {isDemoMode && (
                      <button
                        onClick={handleExitDemo}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm font-medium flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Exit Demo Mode</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div data-tutorial="location-selector">
              <LocationSelector />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-4 mt-4" data-tutorial="alert-summary">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <CloudRain className="w-4 h-4 text-blue-300" />
            <div>
              <div className="text-xs text-emerald-200">Floods</div>
              <div className="text-lg font-bold">{floodAlerts}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <Flame className="w-4 h-4 text-orange-300" />
            <div>
              <div className="text-xs text-emerald-200">Wildfires</div>
              <div className="text-lg font-bold">{wildfireAlerts}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <Droplets className="w-4 h-4 text-cyan-300" />
            <div>
              <div className="text-xs text-emerald-200">Pollution</div>
              <div className="text-lg font-bold">{pollutionAlerts}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <Thermometer className="w-4 h-4 text-red-300" />
            <div>
              <div className="text-xs text-emerald-200">Heat</div>
              <div className="text-lg font-bold">{heatAlerts}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
