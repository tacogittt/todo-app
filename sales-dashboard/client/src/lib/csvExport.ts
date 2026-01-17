import { SalesData, KPIMetrics, CategoryMetrics, RegionalMetrics, AgeGroupMetrics, PaymentMethodMetrics } from './dataProcessor';

export function exportDataToCSV(data: SalesData[], filename: string = 'sales-data.csv') {
  const headers = ['顧客ID', '年齢', '性別', '地域', '購入カテゴリー', '購入金額', '購入日', '支払方法'];
  
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      [
        row.顧客ID,
        row.年齢,
        row.性別,
        row.地域,
        row.購入カテゴリー,
        row.購入金額,
        row.購入日,
        row.支払方法,
      ].join(',')
    ),
  ].join('\n');

  downloadCSV(csvContent, filename);
}

export function exportKPISummaryToCSV(
  kpi: KPIMetrics,
  categories: CategoryMetrics[],
  regions: RegionalMetrics[],
  ageGroups: AgeGroupMetrics[],
  paymentMethods: PaymentMethodMetrics[],
  filename: string = 'kpi-summary.csv'
) {
  let csvContent = 'KPI サマリー\n';
  csvContent += '指標,値\n';
  csvContent += `総売上,¥${kpi.totalSales.toLocaleString('ja-JP')}\n`;
  csvContent += `総注文数,${kpi.totalOrders}\n`;
  csvContent += `ユニークカスタマー,${kpi.uniqueCustomers}\n`;
  csvContent += `平均注文金額,¥${kpi.averageOrderValue.toLocaleString('ja-JP')}\n`;

  csvContent += '\n\nカテゴリー別売上\n';
  csvContent += 'カテゴリー,売上,注文数,割合\n';
  categories.forEach(cat => {
    csvContent += `${cat.category},¥${cat.sales.toLocaleString('ja-JP')},${cat.orders},${cat.percentage}%\n`;
  });

  csvContent += '\n\n地域別売上\n';
  csvContent += '地域,売上,注文数,割合\n';
  regions.forEach(reg => {
    csvContent += `${reg.region},¥${reg.sales.toLocaleString('ja-JP')},${reg.orders},${reg.percentage}%\n`;
  });

  csvContent += '\n\n年齢層別購買分析\n';
  csvContent += '年齢層,売上,件数,平均注文金額\n';
  ageGroups.forEach(age => {
    csvContent += `${age.ageGroup},¥${age.sales.toLocaleString('ja-JP')},${age.count},¥${age.avgOrderValue.toLocaleString('ja-JP')}\n`;
  });

  csvContent += '\n\n支払方法別利用状況\n';
  csvContent += '支払方法,件数,割合,売上\n';
  paymentMethods.forEach(method => {
    csvContent += `${method.method},${method.count},${method.percentage}%,¥${method.totalSales.toLocaleString('ja-JP')}\n`;
  });

  downloadCSV(csvContent, filename);
}

function downloadCSV(csvContent: string, filename: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
