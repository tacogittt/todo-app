import React, { createContext, useContext, useState } from 'react';

export type DrilldownType = 'category' | 'region' | 'ageGroup' | null;

interface DrilldownContextType {
  drilldownType: DrilldownType;
  drilldownValue: string | null;
  setDrilldown: (type: DrilldownType, value: string | null) => void;
  clearDrilldown: () => void;
}

const DrilldownContext = createContext<DrilldownContextType | undefined>(undefined);

export function DrilldownProvider({ children }: { children: React.ReactNode }) {
  const [drilldownType, setDrilldownType] = useState<DrilldownType>(null);
  const [drilldownValue, setDrilldownValue] = useState<string | null>(null);

  const setDrilldown = (type: DrilldownType, value: string | null) => {
    setDrilldownType(type);
    setDrilldownValue(value);
  };

  const clearDrilldown = () => {
    setDrilldownType(null);
    setDrilldownValue(null);
  };

  return (
    <DrilldownContext.Provider value={{ drilldownType, drilldownValue, setDrilldown, clearDrilldown }}>
      {children}
    </DrilldownContext.Provider>
  );
}

export function useDrilldown() {
  const context = useContext(DrilldownContext);
  if (context === undefined) {
    throw new Error('useDrilldown must be used within DrilldownProvider');
  }
  return context;
}
