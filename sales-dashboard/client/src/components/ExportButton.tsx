import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportDataToCSV, exportKPISummaryToCSV } from '@/lib/csvExport';
import { SalesData, KPIMetrics, CategoryMetrics, RegionalMetrics, AgeGroupMetrics, PaymentMethodMetrics } from '@/lib/dataProcessor';

interface ExportButtonProps {
  data: SalesData[];
  kpi: KPIMetrics | null;
  categories: CategoryMetrics[];
  regions: RegionalMetrics[];
  ageGroups: AgeGroupMetrics[];
  paymentMethods: PaymentMethodMetrics[];
}

export function ExportButton({
  data,
  kpi,
  categories,
  regions,
  ageGroups,
  paymentMethods,
}: ExportButtonProps) {
  const handleExportRawData = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportDataToCSV(data, `sales-data-${timestamp}.csv`);
  };

  const handleExportSummary = () => {
    if (!kpi) return;
    const timestamp = new Date().toISOString().split('T')[0];
    exportKPISummaryToCSV(
      kpi,
      categories,
      regions,
      ageGroups,
      paymentMethods,
      `kpi-summary-${timestamp}.csv`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          エクスポート
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportRawData}>
          <span>取引データ (CSV)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportSummary}>
          <span>KPI サマリー (CSV)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
