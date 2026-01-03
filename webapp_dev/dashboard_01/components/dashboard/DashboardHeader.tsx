'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function DashboardHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Assessment sx={{ mr: 2 }} />
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          顧客購買データ分析ダッシュボード
        </Typography>
        <Box>
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
