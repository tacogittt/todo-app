'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box, Grid2 as Grid, Card, CardContent } from '@mui/material';
import type { PurchaseFrequencyResult } from '@/types/analytics';

interface PurchaseFrequencyChartProps {
  data: PurchaseFrequencyResult;
}

const COLORS = ['#1976d2', '#2e7d32'];

export function PurchaseFrequencyChart({ data }: PurchaseFrequencyChartProps) {
  // 新規 vs リピート顧客の比較データ
  const customerTypeData = [
    {
      タイプ: '新規顧客',
      顧客数: data.新規顧客数,
      売上: data.新規顧客売上,
    },
    {
      タイプ: 'リピート顧客',
      顧客数: data.リピート顧客数,
      売上: data.リピート顧客売上,
    },
  ];

  // 購入回数分布データ（上位20件まで表示）
  const frequencyDistribution = data.分布データ.slice(0, 20);

  return (
    <Box>
      {/* サマリーカード */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderLeft: '4px solid #1976d2' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                リピート率
              </Typography>
              <Typography variant="h4" color="#1976d2">
                {data.リピート率.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderLeft: '4px solid #2e7d32' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                平均購入回数
              </Typography>
              <Typography variant="h4" color="#2e7d32">
                {data.平均購入回数.toFixed(1)}回
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderLeft: '4px solid #ed6c02' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                新規顧客数
              </Typography>
              <Typography variant="h4" color="#ed6c02">
                {data.新規顧客数.toLocaleString()}人
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderLeft: '4px solid #9c27b0' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                リピート顧客数
              </Typography>
              <Typography variant="h4" color="#9c27b0">
                {data.リピート顧客数.toLocaleString()}人
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 購入回数分布チャート */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          購入回数分布
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          各購入回数の顧客数を表示
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={frequencyDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="購入回数"
                tick={{ fontSize: 12 }}
                label={{
                  value: '購入回数',
                  position: 'insideBottom',
                  offset: -10,
                  style: { fontSize: 14 }
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: '顧客数',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 14 }
                }}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label) => `購入回数: ${label}回`}
              />
              <Legend />
              <Bar dataKey="顧客数" fill="#1976d2" name="顧客数" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 新規 vs リピート顧客の比較 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              顧客タイプ別：顧客数
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    dataKey="顧客数"
                    nameKey="タイプ"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ タイプ, 顧客数 }) => `${タイプ}: ${顧客数.toLocaleString()}人`}
                  >
                    {customerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()}人`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              顧客タイプ別：売上
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    dataKey="売上"
                    nameKey="タイプ"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ タイプ, 売上 }) => `${タイプ}: ¥${(売上 / 1000000).toFixed(1)}M`}
                  >
                    {customerTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
