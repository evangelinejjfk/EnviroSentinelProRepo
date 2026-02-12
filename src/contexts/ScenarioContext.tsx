import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ScenarioYear = 'now' | '2030' | '2050';

interface ScenarioContextType {
  scenario: ScenarioYear;
  setScenario: (scenario: ScenarioYear) => void;
  getProjectionMultiplier: (riskType: string) => number;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

interface ScenarioProviderProps {
  children: ReactNode;
}

export function ScenarioProvider({ children }: ScenarioProviderProps) {
  const [scenario, setScenario] = useState<ScenarioYear>('now');

  const getProjectionMultiplier = (riskType: string): number => {
    if (scenario === 'now') return 1.0;

    const multipliers: Record<string, Record<ScenarioYear, number>> = {
      flood: { now: 1.0, '2030': 1.25, '2050': 1.6 },
      wildfire: { now: 1.0, '2030': 1.4, '2050': 2.0 },
      heat: { now: 1.0, '2030': 1.3, '2050': 1.8 },
      pollution: { now: 1.0, '2030': 1.15, '2050': 1.35 }
    };

    return multipliers[riskType]?.[scenario] || 1.0;
  };

  return (
    <ScenarioContext.Provider value={{ scenario, setScenario, getProjectionMultiplier }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
}
