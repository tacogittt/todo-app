import _ from 'lodash';
import { format } from 'date-fns';
import type { PurchaseRecord } from '@/types/purchase';
import type {
  MetricsSummary,
  TimeSeriesData,
  CategoryData,
} from '@/types/analytics';

/**
 * 基本統計を計算
 */
export function calculateMetrics(data: PurchaseRecord[]): MetricsSummary {
  const 総購入金額 = _.sumBy(data, '購入金額');
  const 購入件数 = data.length;
  const ユニーク顧客数 = _.uniq(data.map((d) => d.顧客ID)).length;
  const 平均購入金額 = 購入件数 > 0 ? 総購入金額 / 購入件数 : 0;

  return {
    総購入金額,
    購入件数,
    ユニーク顧客数,
    平均購入金額,
  };
}

/**
 * カテゴリー別に集計
 */
export function aggregateByCategory(data: PurchaseRecord[]): CategoryData[] {
  const grouped = _.groupBy(data, '購入カテゴリー');

  return Object.entries(grouped).map(([category, records]) => ({
    カテゴリー: category,
    購入金額: _.sumBy(records, '購入金額'),
    件数: records.length,
  }));
}

/**
 * 地域別に集計
 */
export function aggregateByRegion(data: PurchaseRecord[]): CategoryData[] {
  const grouped = _.groupBy(data, '地域');

  return Object.entries(grouped).map(([region, records]) => ({
    カテゴリー: region,
    購入金額: _.sumBy(records, '購入金額'),
    件数: records.length,
  }));
}

/**
 * 性別別に集計
 */
export function aggregateByGender(data: PurchaseRecord[]): CategoryData[] {
  const grouped = _.groupBy(data, '性別');

  return Object.entries(grouped).map(([gender, records]) => ({
    カテゴリー: gender,
    購入金額: _.sumBy(records, '購入金額'),
    件数: records.length,
  }));
}

/**
 * 支払方法別に集計
 */
export function aggregateByPaymentMethod(
  data: PurchaseRecord[]
): CategoryData[] {
  const grouped = _.groupBy(data, '支払方法');

  return Object.entries(grouped).map(([method, records]) => ({
    カテゴリー: method,
    購入金額: _.sumBy(records, '購入金額'),
    件数: records.length,
  }));
}

/**
 * 月別時系列データを生成
 */
export function getMonthlyTimeSeries(
  data: PurchaseRecord[]
): TimeSeriesData[] {
  const grouped = _.groupBy(data, '購入月');

  const timeSeries = Object.entries(grouped)
    .map(([month, records]) => ({
      月: month,
      購入金額: _.sumBy(records, '購入金額'),
      件数: records.length,
      顧客数: _.uniq(records.map((r) => r.顧客ID)).length,
    }))
    .sort((a, b) => a.月.localeCompare(b.月));

  return timeSeries;
}

/**
 * 日別時系列データを生成
 */
export function getDailyTimeSeries(data: PurchaseRecord[]): TimeSeriesData[] {
  const grouped = _.groupBy(data, (record) =>
    format(record.購入日, 'yyyy-MM-dd')
  );

  const timeSeries = Object.entries(grouped)
    .map(([day, records]) => ({
      月: day,
      購入金額: _.sumBy(records, '購入金額'),
      件数: records.length,
      顧客数: _.uniq(records.map((r) => r.顧客ID)).length,
    }))
    .sort((a, b) => a.月.localeCompare(b.月));

  return timeSeries;
}
