import { Map, CloudRain, Flame, Droplets, Thermometer, Navigation, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'map', label: 'Overview', icon: Map },
    { id: 'floods', label: 'Flood Forecast', icon: CloudRain },
    { id: 'wildfires', label: 'Wildfire Detection', icon: Flame },
    { id: 'microplastic', label: 'Microplastic Mapper', icon: Droplets },
    { id: 'heat-island', label: 'Heat Island Predictor', icon: Thermometer },
    { id: 'eco-route', label: 'EcoRoute', icon: Navigation },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="bg-gradient-to-b from-emerald-950 to-teal-950 text-white w-64 min-h-screen p-4 hidden lg:block border-r border-emerald-800/30">
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

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
