import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
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
import { KPICard } from '@/components/KPICard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { ExportButton } from '@/components/ExportButton';
import { DrilldownDetail } from '@/components/DrilldownDetail';
import { SearchFilterPanel } from '@/components/SearchFilterPanel';
import { useDrilldown } from '@/contexts/DrilldownContext';
import { useFilters } from '@/contexts/FilterContext';
import {
  loadSalesData,
  filterDataByDateRange,
  filterDataBySearchCriteria,
  getDateRange,
  getUniquePaymentMethods,
  calculateKPIMetrics,
  calculateCategoryMetrics,
  calculateRegionalMetrics,
  calculateTimeSeriesData,
  calculateAgeGroupMetrics,
  calculatePaymentMethodMetrics,
  calculateMonthlyTrend,
  SalesData,
  KPIMetrics,
  CategoryMetrics,
  RegionalMetrics,
  TimeSeriesData,
  AgeGroupMetrics,
  PaymentMethodMetrics,
} from '@/lib/dataProcessor';
import { BarChart3, TrendingUp, Users, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Home() {
  const { drilldownType, drilldownValue, setDrilldown, clearDrilldown } = useDrilldown();
  const { filters } = useFilters();
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<SalesData[]>([]);
  const [dateFilteredData, setDateFilteredData] = useState<SalesData[]>([]);
  const [displayData, setDisplayData] = useState<SalesData[]>([]);
  const [dateRange, setDateRange] = useState<{ minDate: Date; maxDate: Date } | null>(null);
  const [kpi, setKpi] = useState<KPIMetrics | null>(null);
  const [categories, setCategories] = useState<CategoryMetrics[]>([]);
  const [regions, setRegions] = useState<RegionalMetrics[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroupMetrics[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodMetrics[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<TimeSeriesData[]>([]);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await loadSalesData();
        setAllData(salesData);
        setDateFilteredData(salesData);
        setDisplayData(salesData);
        setDateRange(getDateRange(salesData));
        setAvailablePaymentMethods(getUniquePaymentMethods(salesData));
        updateMetrics(salesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply date filter
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    const dateFiltered = filterDataByDateRange(allData, startDate, endDate);
    setDateFilteredData(dateFiltered);
  };

  // Apply search filters on top of date filters
  useEffect(() => {
    const searchFiltered = filterDataBySearchCriteria(
      dateFilteredData,
      filters.customerId,
      filters.paymentMethod,
      filters.gender
    );
    setDisplayData(searchFiltered);
  }, [dateFilteredData, filters]);

  // Update metrics when display data changes
  useEffect(() => {
    updateMetrics(displayData);
  }, [displayData]);

  const updateMetrics = (data: SalesData[]) => {
    const kpiMetrics = calculateKPIMetrics(data);
    setKpi(kpiMetrics);

    const categoryMetrics = calculateCategoryMetrics(data);
    setCategories(categoryMetrics);

    const regionalMetrics = calculateRegionalMetrics(data);
    setRegions(regionalMetrics);

    const timeSeriesData = calculateTimeSeriesData(data);
    setTimeSeries(timeSeriesData);

    const ageGroupMetrics = calculateAgeGroupMetrics(data);
    setAgeGroups(ageGroupMetrics);

    const paymentMethodMetrics = calculatePaymentMethodMetrics(data);
    setPaymentMethods(paymentMethodMetrics);

    const monthlyTrendData = calculateMonthlyTrend(data);
    setMonthlyTrend(monthlyTrendData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">売上分析ダッシュボード</h1>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              リアルタイム売上パフォーマンス • {displayData.length} 件の取引データを分析
            </p>
            <div className="flex gap-2">
              {dateRange && (
                <DateRangeFilter
                  onDateRangeChange={handleDateRangeChange}
                  minDate={dateRange.minDate}
                  maxDate={dateRange.maxDate}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearchPanel(true)}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                詳細検索
              </Button>
              {kpi && (
                <ExportButton
                  data={displayData}
                  kpi={kpi}
                  categories={categories}
                  regions={regions}
                  ageGroups={ageGroups}
                  paymentMethods={paymentMethods}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-fade-in-up stagger-0">
            <KPICard
              title="総売上"
              value={kpi ? kpi.totalSales : 0}
              format="currency"
              description="分析期間全体における総売上金額"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>
          <div className="animate-fade-in-up stagger-1">
            <KPICard
              title="総注文数"
              value={kpi ? kpi.totalOrders : 0}
              format="number"
              description="分析期間における全ての注文件数"
              icon={<ShoppingCart className="w-5 h-5" />}
            />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <KPICard
              title="ユニークカスタマー"
              value={kpi ? kpi.uniqueCustomers : 0}
              format="number"
              description="異なる顧客IDの総数"
              icon={<Users className="w-5 h-5" />}
            />
          </div>
          <div className="animate-fade-in-up stagger-3">
            <KPICard
              title="平均注文金額"
              value={kpi ? kpi.averageOrderValue : 0}
              format="currency"
              description="総売上を総注文数で割った値"
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend */}
          <div className="chart-card animate-fade-in-up stagger-0">
            <h2 className="text-lg font-semibold text-foreground mb-4">月別売上推移</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `¥${Number(value).toLocaleString('ja-JP')}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="売上"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="chart-card animate-fade-in-up stagger-1">
            <h2 className="text-lg font-semibold text-foreground mb-4">カテゴリー別売上</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="45%"
                  cy="50%"
                  labelLine={true}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="sales"
                  onClick={(entry) => setDrilldown('category', entry.category)}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `¥${Number(value).toLocaleString('ja-JP')}`}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">クリックで詳細を表示</p>
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="chart-card animate-fade-in-up stagger-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">地域別売上</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={regions}
                onClick={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    const region = regions[state.activeTooltipIndex];
                    setDrilldown('region', region.region);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="region"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `¥${Number(value).toLocaleString('ja-JP')}`}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#059669" name="売上" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">クリックで詳細を表示</p>
          </div>

          {/* Age Group Analysis */}
          <div className="chart-card animate-fade-in-up stagger-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">年齢層別購買分析</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ageGroups}
                onClick={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    const ageGroup = ageGroups[state.activeTooltipIndex];
                    setDrilldown('ageGroup', ageGroup.ageGroup);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="ageGroup"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                  label={{ value: '年齢層', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: '12px' }}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `¥${Number(value).toLocaleString('ja-JP')}`}
                  cursor={{ fill: 'rgba(217, 119, 6, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#d97706" name="売上" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">クリックで詳細を表示</p>
          </div>
        </div>

        {/* Payment Method Analysis */}
        <div className="chart-card animate-fade-in-up stagger-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">支払方法別利用状況</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.method} className="bg-background border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">{method.method}</p>
                <p className="text-2xl font-bold text-foreground mb-1">{method.count}件</p>
                <p className="text-xs text-muted-foreground mb-3">{method.percentage}%</p>
                <p className="text-sm font-semibold text-primary">
                  ¥{method.totalSales.toLocaleString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="chart-card animate-fade-in-up stagger-5">
          <h2 className="text-lg font-semibold text-foreground mb-6">カテゴリー別パフォーマンス</h2>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{category.category}</p>
                  <p className="text-xs text-muted-foreground">{category.orders}件の注文</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ¥{category.sales.toLocaleString('ja-JP')}
                  </p>
                  <p className="text-xs text-primary">{category.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drilldown Modal */}
      {drilldownType && drilldownValue && (
        <DrilldownDetail
          type={drilldownType}
          value={drilldownValue}
          data={displayData}
          onClose={clearDrilldown}
        />
      )}

      {/* Search Filter Panel */}
      {showSearchPanel && (
        <SearchFilterPanel
          paymentMethods={availablePaymentMethods}
          onClose={() => setShowSearchPanel(false)}
        />
      )}
    </div>
  );
}
