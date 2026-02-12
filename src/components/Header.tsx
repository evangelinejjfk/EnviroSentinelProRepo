import { Globe2, CloudRain, Flame, Droplets, Thermometer, Play, Calendar } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { useDemo } from '../contexts/DemoContext';
import { useScenario, ScenarioYear } from '../contexts/ScenarioContext';

interface HeaderProps {
  activeAlerts: number;
  floodAlerts: number;
  wildfireAlerts: number;
  pollutionAlerts?: number;
  heatAlerts?: number;
}

export function Header({ floodAlerts, wildfireAlerts, pollutionAlerts = 0, heatAlerts = 0 }: HeaderProps) {
  const { isDemoMode } = useDemo();
  const { scenario, setScenario } = useScenario();

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

            {isDemoMode && (
              <div className="flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-300/50">
                <Play className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-semibold text-orange-200">Demo Mode</span>
              </div>
            )}

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
