'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { PurchaseRecord } from '@/types/purchase';
import { loadPurchaseData } from '@/lib/dataLoader';

interface DataContextType {
  data: PurchaseRecord[];
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPurchaseData()
      .then((records) => {
        setData(records);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
