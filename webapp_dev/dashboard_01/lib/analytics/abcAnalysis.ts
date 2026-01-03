import _ from 'lodash';
import type { PurchaseRecord } from '@/types/purchase';
import type { ABCResult } from '@/types/analytics';

/**
 * ABC分析を実行し、顧客をA/B/Cランクに分類
 * パレートの法則に基づき、上位20%の顧客をAランク、次の30%をBランク、残りをCランクとする
 */
export function calculateABCSegmentation(
  data: PurchaseRecord[]
): ABCResult[] {
  // 顧客別に購入データを集計
  const customerSales = _(data)
    .groupBy('顧客ID')
    .map((records, 顧客ID) => ({
      顧客ID,
      総購入金額: _.sumBy(records, '購入金額'),
      購入回数: records.length,
    }))
    .orderBy('総購入金額', 'desc')
    .value();

  // 全体の売上合計を計算
  const totalSales = _.sumBy(customerSales, '総購入金額');
  let cumulativeSales = 0;
  const totalCustomers = customerSales.length;

  // 各顧客に累積売上比率とABCランクを付与
  return customerSales.map((customer, index) => {
    cumulativeSales += customer.総購入金額;
    const 累積売上比率 = totalSales > 0 ? (cumulativeSales / totalSales) * 100 : 0;

    // 顧客数に基づいてランク付け
    // A: 上位20%, B: 次の30%, C: 残り50%
    const percentile = (index + 1) / totalCustomers;
    let ABCランク: 'A' | 'B' | 'C';

    if (percentile <= 0.2) {
      ABCランク = 'A';
    } else if (percentile <= 0.5) {
      ABCランク = 'B';
    } else {
      ABCランク = 'C';
    }

    return {
      ...customer,
      ABCランク,
      累積売上比率,
    };
  });
}

/**
 * ABCランク別のサマリー統計を計算
 */
export function getABCSummary(abcResults: ABCResult[]) {
  const summary = _(abcResults)
    .groupBy('ABCランク')
    .map((records, rank) => ({
      ランク: rank,
      顧客数: records.length,
      総購入金額: _.sumBy(records, '総購入金額'),
      平均購入金額: _.meanBy(records, '総購入金額'),
      購入回数合計: _.sumBy(records, '購入回数'),
    }))
    .value();

  return summary;
}
