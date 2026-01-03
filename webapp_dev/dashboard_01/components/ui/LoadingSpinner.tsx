import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        データを読み込み中...
      </Typography>
    </Box>
  );
}
