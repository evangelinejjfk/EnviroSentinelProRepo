import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TutorialStep = {
  id: string;
  title: string;
  description: string;
  page: string;
  highlightElement?: string;
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
    id: 'welcome',
    title: 'Welcome to Climate Guardian',
    description: 'Your comprehensive environmental monitoring platform',
    page: '/',
    explanation: 'Climate Guardian combines real-time data from multiple sources to provide actionable environmental insights.',
    whyItMatters: 'Climate risks are interconnected. Understanding them together helps you make informed decisions.'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'See all environmental risks at a glance',
    page: '/dashboard',
    explanation: 'The dashboard shows active alerts, risk summaries, and key metrics for your selected location.',
    whyItMatters: 'Quick access to critical information helps you respond to environmental threats faster.'
  },
  {
    id: 'location',
    title: 'Location Selection',
    description: 'Choose your area of interest',
    page: '/dashboard',
    highlightElement: 'location-selector',
    explanation: 'You can search for any location or use your current position to get localized environmental data.',
    whyItMatters: 'Environmental risks vary greatly by location. Personalized data helps you prepare better.'
  },
  {
    id: 'floods',
    title: 'Flood Forecasting',
    description: 'Predict flood risks before they happen',
    page: '/floods',
    explanation: 'Our flood forecasting system combines precipitation data, terrain analysis, and historical patterns.',
    whyItMatters: 'Early flood warnings can save lives and reduce property damage by 30-40%.'
  },
  {
    id: 'wildfires',
    title: 'Wildfire Detection',
    description: 'Track active wildfires in real-time',
    page: '/wildfires',
    explanation: 'Satellite data and ground sensors detect wildfires and predict their spread patterns.',
    whyItMatters: 'Wildfires spread rapidly. Minutes matter when evacuating or protecting property.'
  },
  {
    id: 'heat',
    title: 'Heat Island Monitoring',
    description: 'Urban heat islands and extreme temperatures',
    page: '/heat',
    explanation: 'Track heat waves and identify urban areas with elevated temperatures due to infrastructure.',
    whyItMatters: 'Heat-related deaths have increased 60% in recent decades. Prevention starts with awareness.'
  },
  {
    id: 'microplastics',
    title: 'Microplastic Tracking',
    description: 'Monitor water contamination',
    page: '/microplastics',
    explanation: 'Track microplastic pollution in water sources using sensor networks and predictive models.',
    whyItMatters: 'Microplastics affect drinking water quality and ecosystem health. Know your exposure.'
  },
  {
    id: 'ecoroute',
    title: 'EcoRoute Optimization',
    description: 'Plan emission-efficient routes',
    page: '/ecoroute',
    explanation: 'Calculate routes that minimize emissions while considering air quality and environmental exposure.',
    whyItMatters: 'Transportation accounts for 27% of emissions. Every route choice makes a difference.'
  },
  {
    id: 'community',
    title: 'Community Reports',
    description: 'Crowdsourced environmental observations',
    page: '/community',
    explanation: 'Community members submit real-time observations that complement official data sources.',
    whyItMatters: 'Local knowledge fills gaps in satellite and sensor data. Your reports help others stay safe.'
  },
  {
    id: 'analytics',
    title: 'Risk Analytics',
    description: 'Understand how risks connect',
    page: '/risk-correlations',
    explanation: 'Visualize relationships between different environmental risks and identify compound threats.',
    whyItMatters: 'Risks rarely occur in isolation. Compound risks (drought + heat) are deadlier than single threats.'
  },
  {
    id: 'filters',
    title: 'Data Filtering',
    description: 'Focus on what matters to you',
    page: '/dashboard',
    highlightElement: 'filter-panel',
    explanation: 'Filter by risk severity, time range, and specific hazard types to customize your view.',
    whyItMatters: 'Not all alerts are relevant to everyone. Filters help you focus on your priorities.'
  },
  {
    id: 'scenarios',
    title: 'Time Projections',
    description: 'Explore future climate scenarios',
    page: '/dashboard',
    highlightElement: 'scenario-selector',
    explanation: 'See how environmental risks may evolve under different climate scenarios (present, 2030, 2050).',
    whyItMatters: 'Planning requires foresight. Understanding future risks helps communities adapt proactively.'
  },
  {
    id: 'alerts',
    title: 'Alert Configuration',
    description: 'Customize your notifications',
    page: '/settings',
    explanation: 'Configure which alerts you receive and set thresholds for different risk levels.',
    whyItMatters: 'Alert fatigue is real. Personalized notifications ensure you see what matters without overwhelm.'
  },
  {
    id: 'impact',
    title: 'Personal Impact',
    description: 'Track your environmental footprint',
    page: '/impact',
    explanation: 'Monitor your carbon footprint, water usage, and environmental impact over time.',
    whyItMatters: 'Individual actions matter. Tracking helps you see progress and stay motivated.'
  },
  {
    id: 'completion',
    title: 'Tutorial Complete',
    description: "You're ready to use Climate Guardian!",
    page: '/dashboard',
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
