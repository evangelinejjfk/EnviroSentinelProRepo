import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertType, Severity } from '../types';

export type TimeWindow = '24h' | '48h' | '7d' | '30d';

interface FilterState {
  categories: AlertType[];
  severities: Severity[];
  timeWindow: TimeWindow;
}

interface FilterContextType {
  filters: FilterState;
  setCategories: (categories: AlertType[]) => void;
  setSeverities: (severities: Severity[]) => void;
  setTimeWindow: (timeWindow: TimeWindow) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  severities: [],
  timeWindow: '7d'
};

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setCategories = (categories: AlertType[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const setSeverities = (severities: Severity[]) => {
    setFilters(prev => ({ ...prev, severities }));
  };

  const setTimeWindow = (timeWindow: TimeWindow) => {
    setFilters(prev => ({ ...prev, timeWindow }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.severities.length > 0 ||
    filters.timeWindow !== '7d';

  return (
    <FilterContext.Provider
      value={{
        filters,
        setCategories,
        setSeverities,
        setTimeWindow,
        clearFilters,
        hasActiveFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
