'use client';

import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
  Analytics,
  TrendingUp,
  Groups,
  Assessment,
} from '@mui/icons-material';
import { useFilters } from '@/contexts/FilterContext';
import type { AnalysisMode } from '@/types/filters';

const TABS: { mode: AnalysisMode; label: string; icon: React.ReactElement }[] = [
  { mode: '通常分析', label: '通常分析', icon: <Analytics /> },
  { mode: 'ABC分析', label: 'ABC分析', icon: <TrendingUp /> },
  { mode: 'RFM分析', label: 'RFM分析', icon: <Groups /> },
  { mode: '購入回数分析', label: '購入回数分析', icon: <Assessment /> },
];

export function AnalysisModeTabs() {
  const { analysisMode, setAnalysisMode } = useFilters();

  const handleChange = (_: React.SyntheticEvent, newValue: AnalysisMode) => {
    setAnalysisMode(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs
        value={analysisMode}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.mode}
            value={tab.mode}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );
}
