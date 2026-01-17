import React, { createContext, useContext, useState } from 'react';

export interface SearchFilters {
  customerId: string;
  paymentMethod: string;
  gender: string;
}

interface FilterContextType {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DEFAULT_FILTERS: SearchFilters = {
  customerId: '',
  paymentMethod: '',
  gender: '',
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters, hasActiveFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
