import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Location } from './LocationContext';

export type DemoScenario = 'none' | 'sacramento-flood' | 'california-wildfire' | 'phoenix-heatwave';

interface DemoContextType {
  isDemoMode: boolean;
  activeScenario: DemoScenario;
  loadScenario: (scenario: DemoScenario) => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
}

export const DEMO_SCENARIOS: Record<DemoScenario, { location: Location; description: string } | null> = {
  none: null,
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeScenario, setActiveScenario] = useState<DemoScenario>('none');

  const loadScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setIsDemoMode(scenario !== 'none');
  };

  const exitDemoMode = () => {
    setActiveScenario('none');
    setIsDemoMode(false);
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, activeScenario, loadScenario, exitDemoMode }}>
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
