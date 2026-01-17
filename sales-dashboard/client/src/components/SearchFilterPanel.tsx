import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/contexts/FilterContext';

interface SearchFilterPanelProps {
  paymentMethods: string[];
  onClose: () => void;
}

export function SearchFilterPanel({ paymentMethods, onClose }: SearchFilterPanelProps) {
  const { filters, setFilters, resetFilters, hasActiveFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters);

  // Update localFilters when filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    console.log('Applying filters:', localFilters);
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      customerId: '',
      paymentMethod: '',
      gender: '',
    };
    setLocalFilters(emptyFilters);
    resetFilters();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5" />
            詳細検索
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              顧客ID
            </label>
            <Input
              placeholder="顧客IDを入力"
              value={localFilters.customerId}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  customerId: e.target.value,
                })
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              部分一致で検索します
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              支払方法
            </label>
            <Select
              value={localFilters.paymentMethod || "all"}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  paymentMethod: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="支払方法を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {Array.from(new Set(paymentMethods))
                  .sort()
                  .map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              性別
            </label>
            <Select
              value={localFilters.gender || "all"}
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  gender: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="性別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="男性">男性</SelectItem>
                <SelectItem value="女性">女性</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                アクティブなフィルター：
              </p>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                {filters.customerId && (
                  <p>• 顧客ID: <span className="font-semibold">{filters.customerId}</span></p>
                )}
                {filters.paymentMethod && (
                  <p>• 支払方法: <span className="font-semibold">{filters.paymentMethod}</span></p>
                )}
                {filters.gender && (
                  <p>• 性別: <span className="font-semibold">{filters.gender}</span></p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              リセット
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              適用
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
