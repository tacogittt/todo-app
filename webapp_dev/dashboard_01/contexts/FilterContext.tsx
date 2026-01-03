'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { FilterState, AnalysisMode } from '@/types/filters';
import { DEFAULT_FILTER_STATE } from '@/types/filters';

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  analysisMode: AnalysisMode;
  setAnalysisMode: React.Dispatch<React.SetStateAction<AnalysisMode>>;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('通常分析');

  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        analysisMode,
        setAnalysisMode,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
