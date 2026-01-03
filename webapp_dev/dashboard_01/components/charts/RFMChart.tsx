'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { Paper, Typography, Box, Grid2 as Grid, Card, CardContent } from '@mui/material';
import type { RFMResult } from '@/types/analytics';

interface RFMChartProps {
  data: RFMResult[];
}

const SEGMENT_COLORS: Record<string, string> = {
  優良顧客: '#1976d2',
  有望顧客: '#2e7d32',
  休眠顧客: '#d32f2f',
  新規優良顧客: '#9c27b0',
  新規顧客: '#ed6c02',
  一般顧客: '#757575',
};

export function RFMChart({ data }: RFMChartProps) {
  // セグメント別サマリー
  const segments = Array.from(new Set(data.map((d) => d.顧客セグメント)));
  const summary = segments.map((segment) => {
    const items = data.filter((d) => d.顧客セグメント === segment);
    return {
      セグメント: segment,
      顧客数: items.length,
      総売上: items.reduce((sum, item) => sum + item.Monetary, 0),
      平均RFMスコア: items.reduce((sum, item) => sum + item.RFM_Score, 0) / items.length,
    };
  }).sort((a, b) => b.平均RFMスコア - a.平均RFMスコア);

  // スキャッターチャート用データ（Monetary をサイズで表現）
  const scatterData = data.map((item) => ({
    ...item,
    size: Math.log(item.Monetary + 1) * 10, // 対数スケール
  }));

  return (
    <Box>
      {/* セグメント別サマリー */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {summary.map((seg) => {
          const color = SEGMENT_COLORS[seg.セグメント] || '#757575';
          return (
            <Grid key={seg.セグメント} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={2} sx={{ borderLeft: `4px solid ${color}` }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color={color}>
                    {seg.セグメント}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    顧客数: {seg.顧客数}人
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    総売上: ¥{seg.総売上.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    平均RFMスコア: {seg.平均RFMスコア.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* RFMスキャッターチャート */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          RFM分析：RecencyとFrequencyの関係
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          バブルサイズ = 総購入金額（Monetary）
        </Typography>
        <Box sx={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="Recency"
                name="最終購入からの日数"
                tick={{ fontSize: 12 }}
                label={{
                  value: '最終購入からの日数 (Recency)',
                  position: 'insideBottom',
                  offset: -10,
                  style: { fontSize: 14 }
                }}
                domain={[0, 'auto']}
              />
              <YAxis
                type="number"
                dataKey="Frequency"
                name="購入回数"
                tick={{ fontSize: 12 }}
                label={{
                  value: '購入回数 (Frequency)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 14 }
                }}
                domain={[0, 'auto']}
                allowDecimals={false}
              />
              <ZAxis type="number" dataKey="size" range={[50, 800]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RFMResult & { size: number };
                    return (
                      <Box
                        sx={{
                          bgcolor: 'background.paper',
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          顧客ID: {data.顧客ID}
                        </Typography>
                        <Typography variant="body2" color={SEGMENT_COLORS[data.顧客セグメント]}>
                          セグメント: {data.顧客セグメント}
                        </Typography>
                        <Typography variant="body2">
                          Recency: {data.Recency}日
                        </Typography>
                        <Typography variant="body2">
                          Frequency: {data.Frequency}回
                        </Typography>
                        <Typography variant="body2">
                          Monetary: ¥{data.Monetary.toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          RFMスコア: {data.RFM_Score.toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {segments.map((segment) => (
                <Scatter
                  key={segment}
                  name={segment}
                  data={scatterData.filter((d) => d.顧客セグメント === segment)}
                  fill={SEGMENT_COLORS[segment] || '#757575'}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
