'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, Grid2 as Grid, Card, CardContent } from '@mui/material';
import type { ABCResult } from '@/types/analytics';

interface ABCChartProps {
  data: ABCResult[];
}

export function ABCChart({ data }: ABCChartProps) {
  // パレート図用のデータ（上位50顧客程度）
  const paretoData = data.slice(0, Math.min(50, data.length));

  // ABC別サマリー
  const summary = {
    A: data.filter((d) => d.ABCランク === 'A'),
    B: data.filter((d) => d.ABCランク === 'B'),
    C: data.filter((d) => d.ABCランク === 'C'),
  };

  return (
    <Box>
      {/* サマリーカード */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(['A', 'B', 'C'] as const).map((rank) => {
          const items = summary[rank];
          const totalSales = items.reduce((sum, item) => sum + item.総購入金額, 0);
          const color = rank === 'A' ? '#1976d2' : rank === 'B' ? '#2e7d32' : '#ed6c02';

          return (
            <Grid key={rank} size={{ xs: 12, md: 4 }}>
              <Card elevation={2} sx={{ borderLeft: `4px solid ${color}` }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color={color}>
                    {rank}ランク
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    顧客数: {items.length}人
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    総売上: ¥{totalSales.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    平均購入額: ¥
                    {items.length > 0
                      ? Math.round(totalSales / items.length).toLocaleString()
                      : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* パレート図 */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          ABCパレート図（上位50顧客）
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <ComposedChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="顧客ID"
                tick={{ fontSize: 10 }}
                interval={4}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === '累積売上比率') {
                    return [`${value.toFixed(1)}%`, name];
                  }
                  return [`¥${value.toLocaleString()}`, name];
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="総購入金額"
                fill="#1976d2"
                name="総購入金額"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="累積売上比率"
                stroke="#d32f2f"
                strokeWidth={2}
                dot={false}
                name="累積売上比率"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
