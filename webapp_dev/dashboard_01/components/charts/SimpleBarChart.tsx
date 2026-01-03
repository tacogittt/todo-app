'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import type { CategoryData } from '@/types/analytics';

interface SimpleBarChartProps {
  data: CategoryData[];
  title: string;
  color?: string;
}

export function SimpleBarChart({ data, title, color = '#1976d2' }: SimpleBarChartProps) {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="カテゴリー" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
            />
            <Tooltip
              formatter={(value: number) => `¥${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="購入金額" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
