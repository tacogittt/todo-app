'use client';

import React, { useMemo } from 'react';
import { Container, Box, Grid2 as Grid, Typography } from '@mui/material';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { AnalysisModeTabs } from '@/components/dashboard/AnalysisModeTabs';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { SimpleBarChart } from '@/components/charts/SimpleBarChart';
import { ABCChart } from '@/components/charts/ABCChart';
import { RFMChart } from '@/components/charts/RFMChart';
import { PurchaseFrequencyChart } from '@/components/charts/PurchaseFrequencyChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useData } from '@/contexts/DataContext';
import { useFilters } from '@/contexts/FilterContext';
import { useFilteredData } from '@/hooks/useFilteredData';
import {
  calculateMetrics,
  getMonthlyTimeSeries,
  aggregateByCategory,
  aggregateByRegion,
  aggregateByGender,
  aggregateByPaymentMethod,
} from '@/lib/dataProcessor';
import { calculateABCSegmentation } from '@/lib/analytics/abcAnalysis';
import { calculateRFMSegmentation } from '@/lib/analytics/rfmAnalysis';
import { calculatePurchaseFrequency } from '@/lib/analytics/purchaseFrequencyAnalysis';

export default function Home() {
  const { data, loading, error } = useData();
  const { filters, analysisMode } = useFilters();
  const filteredData = useFilteredData(data, filters);

  const metrics = useMemo(
    () => calculateMetrics(filteredData),
    [filteredData]
  );

  const timeSeriesData = useMemo(
    () => getMonthlyTimeSeries(filteredData),
    [filteredData]
  );

  const categoryData = useMemo(
    () => aggregateByCategory(filteredData),
    [filteredData]
  );

  const regionData = useMemo(
    () => aggregateByRegion(filteredData),
    [filteredData]
  );

  const genderData = useMemo(
    () => aggregateByGender(filteredData),
    [filteredData]
  );

  const paymentData = useMemo(
    () => aggregateByPaymentMethod(filteredData),
    [filteredData]
  );

  const abcData = useMemo(
    () => calculateABCSegmentation(filteredData),
    [filteredData]
  );

  const rfmData = useMemo(
    () => calculateRFMSegmentation(filteredData),
    [filteredData]
  );

  const purchaseFrequencyData = useMemo(
    () => calculatePurchaseFrequency(filteredData),
    [filteredData]
  );

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <LoadingSpinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader />
        <ErrorMessage error={error} />
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* フィルターパネル */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FilterPanel />
          </Grid>

          {/* メインコンテンツ */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                データ件数: {filteredData.length.toLocaleString()} 件 / 全{' '}
                {data.length.toLocaleString()} 件
              </Typography>
            </Box>

            {/* メトリクスカード */}
            <Box sx={{ mb: 4 }}>
              <MetricsCards metrics={metrics} />
            </Box>

            {/* 分析モードタブ */}
            <AnalysisModeTabs />

            {/* 通常分析 */}
            {analysisMode === '通常分析' && (
              <>
                {/* 時系列チャート */}
                <Box sx={{ mb: 4 }}>
                  <TimeSeriesChart data={timeSeriesData} title="月別購入推移" />
                </Box>

                {/* カテゴリー別・地域別チャート */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <CategoryChart data={categoryData} title="カテゴリー別売上" />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <SimpleBarChart
                      data={regionData}
                      title="地域別売上"
                      color="#2e7d32"
                    />
                  </Grid>
                </Grid>

                {/* 性別・支払方法別チャート */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <SimpleBarChart
                      data={genderData}
                      title="性別別売上"
                      color="#ed6c02"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <SimpleBarChart
                      data={paymentData}
                      title="支払方法別売上"
                      color="#9c27b0"
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* ABC分析 */}
            {analysisMode === 'ABC分析' && (
              <Box sx={{ mb: 4 }}>
                <ABCChart data={abcData} />
              </Box>
            )}

            {/* RFM分析 */}
            {analysisMode === 'RFM分析' && (
              <Box sx={{ mb: 4 }}>
                <RFMChart data={rfmData} />
              </Box>
            )}

            {/* 購入回数分析 */}
            {analysisMode === '購入回数分析' && (
              <Box sx={{ mb: 4 }}>
                <PurchaseFrequencyChart data={purchaseFrequencyData} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
