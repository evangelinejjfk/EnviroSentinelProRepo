import { useState, useEffect } from 'react';
import { X, MapPin, Bell, Sliders, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { location, requestGeolocation } = useLocation();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [enableAlerts, setEnableAlerts] = useState(true);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  const modules = [
    { id: 'floods', label: 'Flood Forecasting', description: 'Real-time flood predictions' },
    { id: 'wildfires', label: 'Wildfire Detection', description: 'Track active wildfires' },
    { id: 'heat', label: 'Heat Monitoring', description: 'Heat wave and urban heat island tracking' },
    { id: 'pollution', label: 'Pollution Tracking', description: 'Air and water quality monitoring' },
    { id: 'ecoroute', label: 'EcoRoute', description: 'Optimize routes for emissions' }
  ];

  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('preferredModules', JSON.stringify(selectedModules));
    localStorage.setItem('alertsEnabled', JSON.stringify(enableAlerts));
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Welcome to EnviroSentinel Pro</h2>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-emerald-100 rounded-full p-4 inline-flex mb-4">
                  <MapPin className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Location</h3>
                <p className="text-gray-600 mb-6">
                  Set your location to receive personalized environmental alerts and forecasts for your area.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                {location ? (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-emerald-900 mb-2">
                      {location.displayName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                    </div>
                    <button
                      onClick={requestGeolocation}
                      className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      Update Location
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={requestGeolocation}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Use My Location
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                      Or search for a location using the location selector in the header
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                  <Sliders className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Modules to Track</h3>
                <p className="text-gray-600 mb-6">
                  Choose the environmental factors most relevant to you. You can always change this later.
                </p>
              </div>

              <div className="space-y-3">
                {modules.map((module) => (
                  <label
                    key={module.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedModules.includes(module.id)
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedModules.includes(module.id)
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedModules.includes(module.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{module.label}</div>
                        <div className="text-sm text-gray-600">{module.description}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module.id)}
                      onChange={() => toggleModule(module.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-4 inline-flex mb-4">
                  <Bell className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enable Alerts</h3>
                <p className="text-gray-600 mb-6">
                  Get notified when environmental risks are detected in your area.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Enable Notifications</div>
                    <div className="text-sm text-gray-600">
                      Receive real-time alerts for environmental hazards
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={enableAlerts}
                      onChange={(e) => setEnableAlerts(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-14 h-8 rounded-full transition-colors ${
                        enableAlerts ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                          enableAlerts ? 'translate-x-7' : 'translate-x-1'
                        } mt-1`}
                      />
                    </div>
                  </div>
                </label>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">You're all set!</h4>
                <p className="text-sm text-emerald-700">
                  Start exploring environmental data for your area. You can customize your preferences anytime in Settings.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip for now
          </button>

          <div className="flex items-center space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center space-x-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-1 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Check className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
