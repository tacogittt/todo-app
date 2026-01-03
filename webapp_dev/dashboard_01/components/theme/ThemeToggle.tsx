'use client';

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeContext();

  return (
    <Tooltip title={mode === 'light' ? 'ダークモードに切替' : 'ライトモードに切替'}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
