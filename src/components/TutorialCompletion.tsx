import { useState, useEffect } from 'react';
import { useTutorial } from '../contexts/TutorialContext';
import { useDemo } from '../contexts/DemoContext';
import { CheckCircle2, Award, Repeat, Sparkles, MapPin } from 'lucide-react';

export function TutorialCompletion() {
  const { isActive, currentStep, totalSteps, completeTutorial, restartTutorial } = useTutorial();
  const { isDemoMode, setDemoMode } = useDemo();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isActive && currentStep === totalSteps - 1) {
      setTimeout(() => setShowModal(true), 500);
    }
  }, [isActive, currentStep, totalSteps]);

  const handleSwitchToRealData = () => {
    setDemoMode(false);
    completeTutorial();
    setShowModal(false);
  };

  const handleStayInDemo = () => {
    completeTutorial();
    setShowModal(false);
  };

  const handleRestartTutorial = () => {
    restartTutorial();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Award className="w-16 h-16 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">
              Congratulations!
            </h2>
            <p className="text-white/90 text-center text-lg">
              You've completed the Climate Guardian tutorial
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2">What You've Learned</h3>
                <ul className="space-y-2 text-emerald-800 text-sm">
                  <li>✓ Monitoring floods, wildfires, heat waves, and pollution</li>
                  <li>✓ Understanding risk correlations and compound threats</li>
                  <li>✓ Using community reports and real-time alerts</li>
                  <li>✓ Planning eco-friendly routes and tracking impact</li>
                  <li>✓ Exploring future climate scenarios</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleSwitchToRealData}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-6 text-left hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-bold text-lg">Switch to Real Data Mode</h4>
                  </div>
                  <p className="text-white/90 text-sm mb-3">
                    Start monitoring actual environmental data for your location using live APIs
                  </p>
                  <div className="flex items-center text-sm text-white/80">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Uses real-time data from NASA, NOAA, and other sources</span>
                  </div>
                </div>
                <div className="text-white/50 group-hover:text-white transition-colors">
                  →
                </div>
              </div>
            </button>

            <button
              onClick={handleStayInDemo}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:border-emerald-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Continue with Demo Data
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Keep exploring with demo scenarios. Perfect for presentations or testing features.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={handleRestartTutorial}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Repeat className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Restart Tutorial</h4>
                    <p className="text-gray-600 text-sm">Go through the tutorial again</p>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Tip:</strong> You can switch between demo and real data modes anytime in Settings.
            The tutorial can also be restarted from the Settings page.
          </div>
        </div>
      </div>
    </div>
  );
}
