'use client';

import React from 'react';
import { Grid2 as Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  People,
  TrendingUp,
} from '@mui/icons-material';
import type { MetricsSummary } from '@/types/analytics';

interface MetricsCardsProps {
  metrics: MetricsSummary;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: '総購入金額',
      value: `¥${metrics.総購入金額.toLocaleString()}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: '購入件数',
      value: metrics.購入件数.toLocaleString(),
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'ユニーク顧客数',
      value: metrics.ユニーク顧客数.toLocaleString(),
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: '平均購入金額',
      value: `¥${Math.round(metrics.平均購入金額).toLocaleString()}`,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: card.color,
                    color: 'white',
                    p: 1,
                    borderRadius: 2,
                    mr: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {card.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
