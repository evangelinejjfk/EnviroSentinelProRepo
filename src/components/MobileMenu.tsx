import { Map, CloudRain, Flame, Droplets, Thermometer, Navigation, Users, BarChart3, Settings, X, Menu, Info, Database, Award, Network } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

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

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                            : 'text-slate-700 hover:bg-emerald-50'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </NavLink>
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
