import { useTutorial } from '../contexts/TutorialContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Info, Lightbulb, SkipForward } from 'lucide-react';

type TooltipPosition = {
  top: number;
  left: number;
  arrowSide: 'top' | 'bottom' | 'left' | 'right';
};

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

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
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const isLastStep = currentStep === totalSteps - 1;

  const calculatePosition = useCallback(() => {
    if (!currentStepData?.target) {
      setPosition(null);
      setSpotlight(null);
      return;
    }

    const el = document.querySelector(currentStepData.target);
    if (!el) {
      setPosition(null);
      setSpotlight(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    const padding = 8;
    const tooltipWidth = 420;
    const tooltipHeight = 320;
    const gap = 16;

    setSpotlight({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    });

    const placement = currentStepData.placement || 'bottom';
    let top = 0;
    let left = 0;
    let arrowSide: 'top' | 'bottom' | 'left' | 'right' = 'top';

    switch (placement) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowSide = 'top';
        break;
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowSide = 'bottom';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        arrowSide = 'left';
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        arrowSide = 'right';
        break;
    }

    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

    setPosition({ top, left, arrowSide });
  }, [currentStepData]);

  useEffect(() => {
    if (!isActive || !currentStepData || isLastStep) return;

    if (currentStepData.page !== location.pathname) {
      setIsTransitioning(true);
      navigate(currentStepData.page);
      return;
    }

    const timer = setTimeout(() => {
      calculatePosition();
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep, isActive, currentStepData, navigate, location.pathname, isLastStep, calculatePosition]);

  useEffect(() => {
    if (!isActive || !currentStepData?.target || isLastStep) return;

    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    resizeObserverRef.current = new ResizeObserver(handleResize);
    const el = document.querySelector(currentStepData.target);
    if (el) resizeObserverRef.current.observe(el);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      resizeObserverRef.current?.disconnect();
    };
  }, [isActive, currentStepData, isLastStep, calculatePosition]);

  if (!isActive || !currentStepData || isLastStep || isTransitioning) return null;

  const arrowClasses: Record<string, string> = {
    top: 'left-1/2 -translate-x-1/2 -top-2 border-l-transparent border-r-transparent border-t-transparent border-b-emerald-600',
    bottom: 'left-1/2 -translate-x-1/2 -bottom-2 border-l-transparent border-r-transparent border-b-transparent border-t-emerald-600',
    left: 'top-1/2 -translate-y-1/2 -left-2 border-t-transparent border-b-transparent border-l-transparent border-r-emerald-600',
    right: 'top-1/2 -translate-y-1/2 -right-2 border-t-transparent border-b-transparent border-r-transparent border-l-emerald-600'
  };

  return (
    <>
      {spotlight && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="tutorial-spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0" y="0"
              width="100%" height="100%"
              fill="rgba(0,0,0,0.5)"
              mask="url(#tutorial-spotlight-mask)"
            />
            <rect
              x={spotlight.left}
              y={spotlight.top}
              width={spotlight.width}
              height={spotlight.height}
              rx="12"
              fill="none"
              stroke="rgba(16,185,129,0.6)"
              strokeWidth="2"
              className="animate-pulse"
            />
          </svg>
        </div>
      )}

      {!spotlight && (
        <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none" />
      )}

      <div
        ref={tooltipRef}
        className="fixed z-50 w-[420px] max-w-[calc(100vw-32px)] animate-fadeIn"
        style={position ? { top: position.top, left: position.left } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-emerald-500">
          {position && (
            <div className={`absolute w-0 h-0 border-[8px] ${arrowClasses[position.arrowSide]}`} />
          )}

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-full">
                  {currentStep + 1}/{totalSteps - 1}
                </span>
                <h3 className="text-lg font-bold">{currentStepData.title}</h3>
              </div>
              <button
                onClick={skipTutorial}
                className="text-white/70 hover:text-white transition-colors p-1"
                title="Skip Tutorial"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-0.5 mt-2">
              {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= currentStep ? 'bg-white' : 'bg-white/25'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-5">
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {currentStepData.description}
            </p>

            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">{currentStepData.explanation}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{currentStepData.whyItMatters}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={skipTutorial}
              className="flex items-center space-x-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>

            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={previousStep}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={nextStep}
                className="flex items-center space-x-1 px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
