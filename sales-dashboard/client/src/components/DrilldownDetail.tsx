import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { SalesData } from '@/lib/dataProcessor';

interface DrilldownDetailProps {
  type: 'category' | 'region' | 'ageGroup';
  value: string;
  data: SalesData[];
  onClose: () => void;
}

export function DrilldownDetail({ type, value, data, onClose }: DrilldownDetailProps) {
  const filteredData = data.filter(item => {
    switch (type) {
      case 'category':
        return item.購入カテゴリー === value;
      case 'region':
        return item.地域 === value;
      case 'ageGroup':
        const [minAge, maxAge] = parseAgeGroup(value);
        return item.年齢 >= minAge && item.年齢 <= maxAge;
      default:
        return false;
    }
  });

  const totalSales = filteredData.reduce((sum, item) => sum + item.購入金額, 0);
  const totalOrders = filteredData.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Monthly trend for selected category/region
  const monthlyData = getMonthlyTrend(filteredData);

  // Payment method breakdown
  const paymentBreakdown = getPaymentMethodBreakdown(filteredData);

  // Age group breakdown (if not already drilling down by age)
  const ageBreakdown = type !== 'ageGroup' ? getAgeGroupBreakdown(filteredData) : null;

  const title = getTitle(type, value);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">売上</p>
              <p className="text-2xl font-bold text-foreground">
                ¥{totalSales.toLocaleString('ja-JP')}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">注文数</p>
              <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">平均注文金額</p>
              <p className="text-2xl font-bold text-foreground">
                ¥{avgOrderValue.toLocaleString('ja-JP')}
              </p>
            </div>
          </div>

          {/* Monthly Trend */}
          {monthlyData.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">月別推移</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Payment Method Breakdown */}
          {paymentBreakdown.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">支払方法別</h3>
              <div className="space-y-2">
                {paymentBreakdown.map((method) => (
                  <div
                    key={method.method}
                    className="flex items-center justify-between p-3 bg-background rounded border border-border"
                  >
                    <span className="font-medium text-foreground">{method.method}</span>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ¥{method.sales.toLocaleString('ja-JP')}
                      </p>
                      <p className="text-xs text-muted-foreground">{method.count} 件</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Age Group Breakdown */}
          {ageBreakdown && ageBreakdown.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">年齢層別</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="ageGroup"
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                    }}
                    formatter={(value) => `¥${Number(value).toLocaleString('ja-JP')}`}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#059669" name="売上" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function parseAgeGroup(ageGroup: string): [number, number] {
  if (ageGroup === '70+') return [70, 100];
  const [min, max] = ageGroup.split('-').map(Number);
  return [min, max];
}

function getTitle(type: string, value: string): string {
  switch (type) {
    case 'category':
      return `${value}の詳細分析`;
    case 'region':
      return `${value}の詳細分析`;
    case 'ageGroup':
      return `${value}歳の詳細分析`;
    default:
      return '詳細分析';
  }
}

function getMonthlyTrend(data: SalesData[]) {
  const monthMap = new Map<string, number>();

  data.forEach(item => {
    const date = new Date(item.購入日);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + item.購入金額);
  });

  return Array.from(monthMap.entries())
    .map(([month, sales]) => ({ month, sales }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function getPaymentMethodBreakdown(data: SalesData[]) {
  const methodMap = new Map<string, { count: number; sales: number }>();

  data.forEach(item => {
    const existing = methodMap.get(item.支払方法) || { count: 0, sales: 0 };
    methodMap.set(item.支払方法, {
      count: existing.count + 1,
      sales: existing.sales + item.購入金額,
    });
  });

  return Array.from(methodMap.entries())
    .map(([method, metrics]) => ({
      method,
      count: metrics.count,
      sales: metrics.sales,
    }))
    .sort((a, b) => b.sales - a.sales);
}

function getAgeGroupBreakdown(data: SalesData[]) {
  const ageGroups = [
    { label: '10-19', min: 10, max: 19 },
    { label: '20-29', min: 20, max: 29 },
    { label: '30-39', min: 30, max: 39 },
    { label: '40-49', min: 40, max: 49 },
    { label: '50-59', min: 50, max: 59 },
    { label: '60-69', min: 60, max: 69 },
    { label: '70+', min: 70, max: 100 },
  ];

  return ageGroups
    .map(group => {
      const groupData = data.filter(item => item.年齢 >= group.min && item.年齢 <= group.max);
      const sales = groupData.reduce((sum, item) => sum + item.購入金額, 0);

      return {
        ageGroup: group.label,
        sales,
        count: groupData.length,
      };
    })
    .filter(g => g.count > 0);
}
