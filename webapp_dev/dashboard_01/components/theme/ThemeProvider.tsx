'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '@/lib/theme';
import { ThemeContextProvider, useThemeContext } from '@/contexts/ThemeContext';

function MUIThemeWrapper({ children }: { children: ReactNode }) {
  const { mode } = useThemeContext();
  const theme = createAppTheme(mode);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContextProvider>
      <MUIThemeWrapper>{children}</MUIThemeWrapper>
    </ThemeContextProvider>
  );
}
