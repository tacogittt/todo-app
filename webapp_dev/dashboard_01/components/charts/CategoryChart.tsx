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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from '@mui/icons-material';
import type { CategoryData } from '@/types/analytics';

interface CategoryChartProps {
  data: CategoryData[];
  title: string;
}

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'];

export function CategoryChart({ data, title }: CategoryChartProps) {
  const [chartType, setChartType] = React.useState<'bar' | 'pie'>('bar');

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, newValue) => newValue && setChartType(newValue)}
          size="small"
        >
          <ToggleButton value="bar">
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value="pie">
            <PieChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          {chartType === 'bar' ? (
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
              <Bar dataKey="購入金額" fill="#1976d2" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey="購入金額"
                nameKey="カテゴリー"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ カテゴリー, percent }) =>
                  `${カテゴリー}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={{ stroke: '#888', strokeWidth: 1 }}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `¥${value.toLocaleString()}`}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
