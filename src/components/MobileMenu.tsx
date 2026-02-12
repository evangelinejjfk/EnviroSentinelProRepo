import { Map, CloudRain, Flame, Droplets, Thermometer, Navigation, BarChart3, Settings, X, Menu } from 'lucide-react';
import { useState } from 'react';

interface MobileMenuProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function MobileMenu({ activeView, onViewChange }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-4 rounded-full shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl z-40 lg:hidden w-72 max-h-[70vh] overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-emerald-900 mb-3">Navigation</h3>
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
