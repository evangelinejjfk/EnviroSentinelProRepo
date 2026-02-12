import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Location } from './LocationContext';

export type DemoScenario = 'none' | 'sacramento' | 'santa-rosa' | 'phoenix' | 'sacramento-flood' | 'california-wildfire' | 'phoenix-heatwave';

interface DemoContextType {
  isDemoMode: boolean;
  activeScenario: DemoScenario;
  loadScenario: (scenario: DemoScenario) => void;
  exitDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  setScenario: (scenario: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
}

export const DEMO_SCENARIOS: Record<DemoScenario, { location: Location; description: string } | null> = {
  none: null,
  'sacramento': {
    location: {
      latitude: 38.5816,
      longitude: -121.4944,
      city: 'Sacramento',
      state: 'CA',
      country: 'USA',
      displayName: 'Sacramento, CA'
    },
    description: 'Simulated major flood event with river overflow and urban flooding'
  },
  'sacramento-flood': {
    location: {
      latitude: 38.5816,
      longitude: -121.4944,
      city: 'Sacramento',
      state: 'CA',
      country: 'USA',
      displayName: 'Sacramento, CA'
    },
    description: 'Simulated major flood event with river overflow and urban flooding'
  },
  'santa-rosa': {
    location: {
      latitude: 38.4404,
      longitude: -122.7141,
      city: 'Santa Rosa',
      state: 'CA',
      country: 'USA',
      displayName: 'Santa Rosa, CA'
    },
    description: 'Simulated wildfire with high winds and dry conditions'
  },
  'california-wildfire': {
    location: {
      latitude: 38.4404,
      longitude: -122.7141,
      city: 'Santa Rosa',
      state: 'CA',
      country: 'USA',
      displayName: 'Santa Rosa, CA'
    },
    description: 'Simulated wildfire with high winds and dry conditions'
  },
  'phoenix': {
    location: {
      latitude: 33.4484,
      longitude: -112.0740,
      city: 'Phoenix',
      state: 'AZ',
      country: 'USA',
      displayName: 'Phoenix, AZ'
    },
    description: 'Simulated extreme heat wave with record temperatures'
  },
  'phoenix-heatwave': {
    location: {
      latitude: 33.4484,
      longitude: -112.0740,
      city: 'Phoenix',
      state: 'AZ',
      country: 'USA',
      displayName: 'Phoenix, AZ'
    },
    description: 'Simulated extreme heat wave with record temperatures'
  }
};

export function DemoProvider({ children }: DemoProviderProps) {
  const [isDemoMode, setIsDemoModeState] = useState(() => {
    const saved = localStorage.getItem('demoMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(() => {
    const saved = localStorage.getItem('activeScenario');
    return saved ? (saved as DemoScenario) : 'none';
  });

  useEffect(() => {
    localStorage.setItem('demoMode', JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem('activeScenario', activeScenario);
  }, [activeScenario]);

  const loadScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setIsDemoModeState(scenario !== 'none');
    if (scenario !== 'none' && DEMO_SCENARIOS[scenario]) {
      const demoData = DEMO_SCENARIOS[scenario];
      if (demoData?.location) {
        localStorage.setItem('selectedLocation', JSON.stringify(demoData.location));
        window.dispatchEvent(new CustomEvent('demoScenarioChange', { detail: { location: demoData.location } }));
      }
    }
  };

  const exitDemoMode = () => {
    setActiveScenario('none');
    setIsDemoModeState(false);
    localStorage.removeItem('activeScenario');
    window.dispatchEvent(new CustomEvent('demoScenarioChange', { detail: { location: null } }));
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoModeState(enabled);
    if (!enabled) {
      setActiveScenario('none');
      localStorage.removeItem('activeScenario');
      window.dispatchEvent(new CustomEvent('demoScenarioChange', { detail: { location: null } }));
    }
  };

  const setScenario = (scenario: string) => {
    const validScenario = scenario as DemoScenario;
    setActiveScenario(validScenario);
    setIsDemoModeState(validScenario !== 'none');
    if (validScenario !== 'none' && DEMO_SCENARIOS[validScenario]) {
      const demoData = DEMO_SCENARIOS[validScenario];
      if (demoData?.location) {
        localStorage.setItem('selectedLocation', JSON.stringify(demoData.location));
        window.dispatchEvent(new CustomEvent('demoScenarioChange', { detail: { location: demoData.location } }));
      }
    }
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      activeScenario,
      loadScenario,
      exitDemoMode,
      setDemoMode,
      setScenario
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
