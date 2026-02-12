import { useTutorial } from '../contexts/TutorialContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Info, Lightbulb, SkipForward } from 'lucide-react';

export function TutorialOverlay() {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    nextStep,
    previousStep,
    skipTutorial
  } = useTutorial();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isActive && currentStepData && currentStepData.page !== location.pathname) {
      navigate(currentStepData.page);
    }
  }, [currentStep, isActive, currentStepData, navigate, location.pathname]);

  if (!isActive || !currentStepData) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-none" />

      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-emerald-500">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium opacity-90">
                    Step {currentStep + 1} of {totalSteps}
                  </div>
                  <h3 className="text-2xl font-bold">{currentStepData.title}</h3>
                </div>
                <button
                  onClick={skipTutorial}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Skip Tutorial"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i <= currentStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-lg text-gray-700 mb-4">
                {currentStepData.description}
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">What This Does</h4>
                      <p className="text-sm text-blue-800">{currentStepData.explanation}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Why It Matters</h4>
                      <p className="text-sm text-amber-800">{currentStepData.whyItMatters}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={skipTutorial}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span className="font-medium">Skip Tutorial</span>
              </button>

              <div className="flex items-center space-x-3">
                {currentStep > 0 && (
                  <button
                    onClick={previousStep}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <span>{currentStep === totalSteps - 1 ? 'Complete' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
