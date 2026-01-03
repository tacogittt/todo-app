import { useMemo } from 'react';
import { isWithinInterval } from 'date-fns';
import type { PurchaseRecord } from '@/types/purchase';
import type { FilterState } from '@/types/filters';

/**
 * フィルター条件に基づいてデータをフィルタリング
 */
export function useFilteredData(
  data: PurchaseRecord[],
  filters: FilterState
): PurchaseRecord[] {
  return useMemo(() => {
    return data.filter((record) => {
      // 地域フィルター
      const regionMatch =
        filters.地域.length === 0 || filters.地域.includes(record.地域);

      // カテゴリーフィルター
      const categoryMatch =
        filters.購入カテゴリー.length === 0 ||
        filters.購入カテゴリー.includes(record.購入カテゴリー);

      // 性別フィルター
      const genderMatch =
        filters.性別.length === 0 || filters.性別.includes(record.性別);

      // 期間フィルター
      const dateMatch = isWithinInterval(record.購入日, {
        start: filters.期間.start,
        end: filters.期間.end,
      });

      return regionMatch && categoryMatch && genderMatch && dateMatch;
    });
  }, [data, filters]);
}
