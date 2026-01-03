import _ from 'lodash';
import type { PurchaseRecord } from '@/types/purchase';
import type { PurchaseFrequencyResult, PurchaseFrequencyData } from '@/types/analytics';

/**
 * 購入回数分析を実行
 * 顧客の購入頻度を分析し、リピート率や購入回数分布を計算
 */
export function calculatePurchaseFrequency(
  data: PurchaseRecord[]
): PurchaseFrequencyResult {
  // 顧客別に購入データを集計
  const customerPurchases = _(data)
    .groupBy('顧客ID')
    .map((records, 顧客ID) => ({
      顧客ID,
      購入回数: records.length,
      総購入金額: _.sumBy(records, '購入金額'),
    }))
    .value();

  // 購入回数別に集計
  const frequencyGroups = _(customerPurchases)
    .groupBy('購入回数')
    .map((customers, 購入回数) => ({
      購入回数: Number(購入回数),
      顧客数: customers.length,
      総購入金額: _.sumBy(customers, '総購入金額'),
      平均購入金額: _.meanBy(customers, '総購入金額'),
    }))
    .orderBy('購入回数', 'asc')
    .value();

  // 統計値を計算
  const 総顧客数 = customerPurchases.length;
  const 新規顧客数 = customerPurchases.filter(c => c.購入回数 === 1).length;
  const リピート顧客数 = 総顧客数 - 新規顧客数;
  const リピート率 = 総顧客数 > 0 ? (リピート顧客数 / 総顧客数) * 100 : 0;

  // 新規顧客とリピート顧客の売上
  const 新規顧客売上 = _(customerPurchases)
    .filter(c => c.購入回数 === 1)
    .sumBy('総購入金額');

  const リピート顧客売上 = _(customerPurchases)
    .filter(c => c.購入回数 > 1)
    .sumBy('総購入金額');

  // 平均購入回数
  const 平均購入回数 = _.meanBy(customerPurchases, '購入回数') || 0;

  return {
    分布データ: frequencyGroups,
    リピート率,
    新規顧客数,
    リピート顧客数,
    新規顧客売上,
    リピート顧客売上,
    平均購入回数,
  };
}

/**
 * 購入回数を区間にグループ化（ヒストグラム用）
 */
export function groupPurchaseFrequency(
  data: PurchaseFrequencyData[],
  binSize: number = 5
): PurchaseFrequencyData[] {
  if (data.length === 0) return [];

  const maxFrequency = _.maxBy(data, '購入回数')?.購入回数 || 0;
  const bins: PurchaseFrequencyData[] = [];

  for (let i = 1; i <= maxFrequency; i += binSize) {
    const binEnd = Math.min(i + binSize - 1, maxFrequency);
    const binData = data.filter(
      d => d.購入回数 >= i && d.購入回数 <= binEnd
    );

    if (binData.length > 0) {
      bins.push({
        購入回数: i === binEnd ? i : i, // ラベル用
        顧客数: _.sumBy(binData, '顧客数'),
        総購入金額: _.sumBy(binData, '総購入金額'),
        平均購入金額: _.meanBy(binData, '総購入金額') || 0,
      });
    }
  }

  return bins;
}
