import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TutorialStep = {
  id: string;
  title: string;
  description: string;
  page: string;
  target?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  explanation: string;
  whyItMatters: string;
};

type TutorialContextType = {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TutorialStep | null;
  selectedScenario: string | null;
  startTutorial: (scenario: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  restartTutorial: () => void;
  goToStep: (step: number) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const tutorialSteps: TutorialStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'This is your main command center. All environmental risks are displayed here at a glance.',
    page: '/',
    target: '[data-tutorial="dashboard-content"]',
    placement: 'bottom',
    explanation: 'The dashboard shows active alerts, risk summaries, and key metrics for your selected location.',
    whyItMatters: 'Quick access to critical information helps you respond to environmental threats faster.'
  },
  {
    id: 'alert-summary',
    title: 'Alert Summary',
    description: 'These counters show active alerts by category. Keep an eye on high numbers.',
    page: '/',
    target: '[data-tutorial="alert-summary"]',
    placement: 'bottom',
    explanation: 'Each counter tracks a different environmental threat in real-time.',
    whyItMatters: 'Monitoring alert counts helps you quickly identify which threats need attention.'
  },
  {
    id: 'location',
    title: 'Location Selection',
    description: 'Change your monitoring location here. Data updates automatically for the selected area.',
    page: '/',
    target: '[data-tutorial="location-selector"]',
    placement: 'bottom',
    explanation: 'Search for any location or use your current position to get localized environmental data.',
    whyItMatters: 'Environmental risks vary greatly by location. Personalized data helps you prepare better.'
  },
  {
    id: 'scenario-selector',
    title: 'Time Projections',
    description: 'Switch between present-day and future projections to see how risks may evolve.',
    page: '/',
    target: '[data-tutorial="scenario-selector"]',
    placement: 'bottom',
    explanation: 'See how environmental risks may change under different climate scenarios (present, 2030, 2050).',
    whyItMatters: 'Planning requires foresight. Understanding future risks helps communities adapt proactively.'
  },
  {
    id: 'sidebar-nav',
    title: 'Navigation',
    description: 'Use the sidebar to navigate between different monitoring modules.',
    page: '/',
    target: '[data-tutorial="sidebar-nav"]',
    placement: 'right',
    explanation: 'Each section focuses on a specific environmental threat or feature.',
    whyItMatters: 'Organized navigation lets you quickly access the data you need during emergencies.'
  },
  {
    id: 'floods',
    title: 'Flood Forecasting',
    description: 'Monitor flood risk levels, precipitation forecasts, and river conditions in your area.',
    page: '/floods',
    target: '[data-tutorial="page-content"]',
    placement: 'top',
    explanation: 'The flood forecasting system combines precipitation data, terrain analysis, and historical patterns.',
    whyItMatters: 'Early flood warnings can save lives and reduce property damage by 30-40%.'
  },
  {
    id: 'wildfires',
    title: 'Wildfire Detection',
    description: 'Track active wildfires, fire danger ratings, and smoke conditions near you.',
    page: '/wildfires',
    target: '[data-tutorial="page-content"]',
    placement: 'top',
    explanation: 'Satellite data and ground sensors detect wildfires and predict their spread patterns.',
    whyItMatters: 'Wildfires spread rapidly. Minutes matter when evacuating or protecting property.'
  },
  {
    id: 'heat',
    title: 'Heat Island Monitoring',
    description: 'Track heat waves and identify urban areas with dangerously elevated temperatures.',
    page: '/heat',
    target: '[data-tutorial="page-content"]',
    placement: 'top',
    explanation: 'Monitor heat waves and identify urban areas with elevated temperatures due to infrastructure.',
    whyItMatters: 'Heat-related deaths have increased 60% in recent decades. Prevention starts with awareness.'
  },
  {
    id: 'community',
    title: 'Community Reports',
    description: 'See reports from other users and submit your own environmental observations.',
    page: '/community',
    target: '[data-tutorial="page-content"]',
    placement: 'top',
    explanation: 'Community members submit real-time observations that complement official data sources.',
    whyItMatters: 'Local knowledge fills gaps in satellite and sensor data. Your reports help others stay safe.'
  },
  {
    id: 'impact',
    title: 'Personal Impact',
    description: 'Track your environmental footprint and see how your actions make a difference.',
    page: '/impact',
    target: '[data-tutorial="page-content"]',
    placement: 'top',
    explanation: 'Monitor your carbon footprint, water usage, and environmental impact over time.',
    whyItMatters: 'Individual actions matter. Tracking helps you see progress and stay motivated.'
  },
  {
    id: 'completion',
    title: 'Tutorial Complete',
    description: "You're ready to use EnviroSentinel Pro!",
    page: '/',
    explanation: 'You now understand all major features. Switch to real data mode to monitor your actual location.',
    whyItMatters: 'Knowledge is power. Use these tools to protect yourself and your community from environmental threats.'
  }
];

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('tutorialCompleted');
    const savedStep = localStorage.getItem('tutorialStep');
    const savedScenario = localStorage.getItem('tutorialScenario');

    if (!hasCompletedTutorial) {
      setTimeout(() => setIsActive(true), 500);
    }

    if (savedStep && savedScenario) {
      setCurrentStep(parseInt(savedStep));
      setSelectedScenario(savedScenario);
    }
  }, []);

  useEffect(() => {
    if (isActive && selectedScenario) {
      localStorage.setItem('tutorialStep', currentStep.toString());
      localStorage.setItem('tutorialScenario', selectedScenario);
    }
  }, [currentStep, isActive, selectedScenario]);

  const startTutorial = (scenario: string) => {
    setSelectedScenario(scenario);
    setIsActive(true);
    setCurrentStep(0);
    localStorage.setItem('tutorialScenario', scenario);
    localStorage.setItem('tutorialStep', '0');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    localStorage.setItem('tutorialCompleted', 'true');
    localStorage.removeItem('tutorialStep');
    localStorage.removeItem('tutorialScenario');
  };

  const completeTutorial = () => {
    setIsActive(false);
    localStorage.setItem('tutorialCompleted', 'true');
    localStorage.removeItem('tutorialStep');
    localStorage.removeItem('tutorialScenario');
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setSelectedScenario(null);
    setIsActive(true);
    localStorage.removeItem('tutorialCompleted');
    localStorage.setItem('tutorialStep', '0');
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < tutorialSteps.length) {
      setCurrentStep(step);
    }
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: tutorialSteps.length,
        currentStepData: isActive ? tutorialSteps[currentStep] : null,
        selectedScenario,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
        restartTutorial,
        goToStep
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
