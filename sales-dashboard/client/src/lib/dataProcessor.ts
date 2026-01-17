export interface SalesData {
  顧客ID: number;
  年齢: number;
  性別: string;
  地域: string;
  購入カテゴリー: string;
  購入金額: number;
  購入日: string;
  支払方法: string;
}

export interface KPIMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  totalCustomers: number;
}

export interface CategoryMetrics {
  category: string;
  sales: number;
  orders: number;
  percentage: number;
}

export interface RegionalMetrics {
  region: string;
  sales: number;
  orders: number;
  percentage: number;
}

export interface TimeSeriesData {
  date: string;
  sales: number;
  orders: number;
}

export interface AgeGroupMetrics {
  ageGroup: string;
  sales: number;
  count: number;
  avgOrderValue: number;
}

export interface PaymentMethodMetrics {
  method: string;
  count: number;
  percentage: number;
  totalSales: number;
}

export async function loadSalesData(): Promise<SalesData[]> {
  const response = await fetch('/data.csv');
  const text = await response.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return {
      顧客ID: parseInt(values[0]),
      年齢: parseInt(values[1]),
      性別: values[2],
      地域: values[3],
      購入カテゴリー: values[4],
      購入金額: parseInt(values[5]),
      購入日: values[6],
      支払方法: values[7],
    };
  });
}

export function filterDataByDateRange(data: SalesData[], startDate: Date | null, endDate: Date | null): SalesData[] {
  if (!startDate && !endDate) {
    return data;
  }

  return data.filter(item => {
    const itemDate = new Date(item.購入日);
    
    if (startDate && itemDate < startDate) {
      return false;
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (itemDate > endOfDay) {
        return false;
      }
    }
    
    return true;
  });
}

export function getDateRange(data: SalesData[]): { minDate: Date; maxDate: Date } {
  if (data.length === 0) {
    return { minDate: new Date(), maxDate: new Date() };
  }

  const dates = data.map(item => new Date(item.購入日));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  return { minDate, maxDate };
}

export function calculateKPIMetrics(data: SalesData[]): KPIMetrics {
  const totalSales = data.reduce((sum, item) => sum + item.購入金額, 0);
  const totalOrders = data.length;
  const uniqueCustomers = new Set(data.map(item => item.顧客ID)).size;
  
  return {
    totalSales,
    totalOrders,
    averageOrderValue: Math.round(totalSales / totalOrders),
    uniqueCustomers,
    totalCustomers: data.length,
  };
}

export function calculateCategoryMetrics(data: SalesData[]): CategoryMetrics[] {
  const categoryMap = new Map<string, { sales: number; orders: number }>();
  
  data.forEach(item => {
    const existing = categoryMap.get(item.購入カテゴリー) || { sales: 0, orders: 0 };
    categoryMap.set(item.購入カテゴリー, {
      sales: existing.sales + item.購入金額,
      orders: existing.orders + 1,
    });
  });
  
  const totalSales = Array.from(categoryMap.values()).reduce((sum, v) => sum + v.sales, 0);
  
  return Array.from(categoryMap.entries())
    .map(([category, metrics]) => ({
      category,
      sales: metrics.sales,
      orders: metrics.orders,
      percentage: Math.round((metrics.sales / totalSales) * 100),
    }))
    .sort((a, b) => b.sales - a.sales);
}

export function calculateRegionalMetrics(data: SalesData[]): RegionalMetrics[] {
  const regionMap = new Map<string, { sales: number; orders: number }>();
  
  data.forEach(item => {
    const existing = regionMap.get(item.地域) || { sales: 0, orders: 0 };
    regionMap.set(item.地域, {
      sales: existing.sales + item.購入金額,
      orders: existing.orders + 1,
    });
  });
  
  const totalSales = Array.from(regionMap.values()).reduce((sum, v) => sum + v.sales, 0);
  
  return Array.from(regionMap.entries())
    .map(([region, metrics]) => ({
      region,
      sales: metrics.sales,
      orders: metrics.orders,
      percentage: Math.round((metrics.sales / totalSales) * 100),
    }))
    .sort((a, b) => b.sales - a.sales);
}

export function calculateTimeSeriesData(data: SalesData[]): TimeSeriesData[] {
  const dateMap = new Map<string, { sales: number; orders: number }>();
  
  data.forEach(item => {
    const existing = dateMap.get(item.購入日) || { sales: 0, orders: 0 };
    dateMap.set(item.購入日, {
      sales: existing.sales + item.購入金額,
      orders: existing.orders + 1,
    });
  });
  
  return Array.from(dateMap.entries())
    .map(([date, metrics]) => ({
      date,
      sales: metrics.sales,
      orders: metrics.orders,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculateAgeGroupMetrics(data: SalesData[]): AgeGroupMetrics[] {
  const ageGroups = [
    { label: '10-19', min: 10, max: 19 },
    { label: '20-29', min: 20, max: 29 },
    { label: '30-39', min: 30, max: 39 },
    { label: '40-49', min: 40, max: 49 },
    { label: '50-59', min: 50, max: 59 },
    { label: '60-69', min: 60, max: 69 },
    { label: '70+', min: 70, max: 100 },
  ];
  
  return ageGroups.map(group => {
    const groupData = data.filter(item => item.年齢 >= group.min && item.年齢 <= group.max);
    const sales = groupData.reduce((sum, item) => sum + item.購入金額, 0);
    
    return {
      ageGroup: group.label,
      sales,
      count: groupData.length,
      avgOrderValue: groupData.length > 0 ? Math.round(sales / groupData.length) : 0,
    };
  }).filter(g => g.count > 0);
}

export function filterDataBySearchCriteria(
  data: SalesData[],
  customerId: string,
  paymentMethod: string,
  gender: string
): SalesData[] {
  return data.filter(item => {
    const matchesCustomerId = customerId === '' || item.顧客ID.toString().includes(customerId);
    const matchesPaymentMethod = paymentMethod === '' || item.支払方法 === paymentMethod;
    const matchesGender = gender === '' || item.性別 === gender;

    return matchesCustomerId && matchesPaymentMethod && matchesGender;
  });
}

export function getUniquePaymentMethods(data: SalesData[]): string[] {
  const methods = new Set(data.map(item => item.支払方法));
  return Array.from(methods).sort();
}

export function calculatePaymentMethodMetrics(data: SalesData[]): PaymentMethodMetrics[] {
  const methodMap = new Map<string, { count: number; sales: number }>();
  
  data.forEach(item => {
    const existing = methodMap.get(item.支払方法) || { count: 0, sales: 0 };
    methodMap.set(item.支払方法, {
      count: existing.count + 1,
      sales: existing.sales + item.購入金額,
    });
  });
  
  const totalCount = data.length;
  
  return Array.from(methodMap.entries())
    .map(([method, metrics]) => ({
      method,
      count: metrics.count,
      percentage: Math.round((metrics.count / totalCount) * 100),
      totalSales: metrics.sales,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPaymentMethodMetrics(data: SalesData[]): PaymentMethodMetrics[] {
  return calculatePaymentMethodMetrics(data);
}

export function calculateMonthlyTrend(data: SalesData[]): TimeSeriesData[] {
  const monthMap = new Map<string, { sales: number; orders: number }>();
  
  data.forEach(item => {
    const date = new Date(item.購入日);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const existing = monthMap.get(monthKey) || { sales: 0, orders: 0 };
    monthMap.set(monthKey, {
      sales: existing.sales + item.購入金額,
      orders: existing.orders + 1,
    });
  });
  
  return Array.from(monthMap.entries())
    .map(([date, metrics]) => ({
      date,
      sales: metrics.sales,
      orders: metrics.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
