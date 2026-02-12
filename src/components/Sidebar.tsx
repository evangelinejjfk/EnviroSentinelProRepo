import { Map, CloudRain, Flame, Droplets, Thermometer, Navigation, Users, BarChart3, Settings, Info, Database, Award, Network } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDemo, DemoScenario, DEMO_SCENARIOS } from '../contexts/DemoContext';

export function Sidebar() {
  const { isDemoMode, loadScenario, exitDemoMode } = useDemo();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Map },
    { path: '/floods', label: 'Floods', icon: CloudRain },
    { path: '/wildfires', label: 'Wildfires', icon: Flame },
    { path: '/heat', label: 'Heat', icon: Thermometer },
    { path: '/microplastics', label: 'Microplastics', icon: Droplets },
    { path: '/ecoroute', label: 'EcoRoute', icon: Navigation },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/risk-correlations', label: 'Risk Insights', icon: Network },
    { path: '/impact', label: 'Impact', icon: Award },
    { path: '/data-sources', label: 'Data Sources', icon: Database },
    { path: '/about', label: 'About', icon: Info },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const demoScenarios: { id: DemoScenario; label: string }[] = [
    { id: 'sacramento-flood', label: 'Sacramento Flood' },
    { id: 'california-wildfire', label: 'California Wildfire' },
    { id: 'phoenix-heatwave', label: 'Phoenix Heat Wave' }
  ];

  return (
    <aside className="bg-gradient-to-b from-emerald-950 to-teal-950 text-white w-64 min-h-screen p-4 hidden lg:block border-r border-emerald-800/30 overflow-y-auto">
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                    : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 p-4 bg-orange-900/30 rounded-lg border border-orange-700/30">
        <h3 className="text-sm font-semibold mb-3 text-orange-200">Demo Scenarios</h3>
        <div className="space-y-2">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => loadScenario(scenario.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-orange-800/30 hover:bg-orange-700/50 text-orange-100 transition-colors"
            >
              {scenario.label}
            </button>
          ))}
          {isDemoMode && (
            <button
              onClick={exitDemoMode}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-red-800/30 hover:bg-red-700/50 text-red-100 transition-colors"
            >
              Exit Demo Mode
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-emerald-900/30 rounded-lg border border-emerald-700/30">
        <h3 className="text-sm font-semibold mb-2 text-emerald-200">System Status</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-emerald-300">Data Sources</span>
            <span className="text-green-400">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-300">AI Models</span>
            <span className="text-green-400">Online</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-300">Last Update</span>
            <span className="text-emerald-100">Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
