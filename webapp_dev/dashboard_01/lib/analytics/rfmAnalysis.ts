import _ from 'lodash';
import { differenceInDays } from 'date-fns';
import type { PurchaseRecord } from '@/types/purchase';
import type { RFMResult, RFMSegment } from '@/types/analytics';

/**
 * 四分位数に基づいてスコア（1-5）を計算
 * Recencyは逆順（日数が少ないほど高スコア）
 */
function calculateScore(
  value: number,
  quartiles: number[],
  isRecency: boolean = false
): number {
  if (isRecency) {
    // Recencyは日数が少ないほど高スコア
    if (value <= quartiles[0]) return 5;
    if (value <= quartiles[1]) return 4;
    if (value <= quartiles[2]) return 3;
    if (value <= quartiles[3]) return 2;
    return 1;
  } else {
    // FrequencyとMonetaryは値が大きいほど高スコア
    if (value >= quartiles[3]) return 5;
    if (value >= quartiles[2]) return 4;
    if (value >= quartiles[1]) return 3;
    if (value >= quartiles[0]) return 2;
    return 1;
  }
}

/**
 * RFMスコアに基づいて顧客セグメントを分類
 */
function classifyRFMSegment(customer: RFMResult): RFMSegment {
  const { RFM_Score, R_Score, F_Score, M_Score } = customer;

  if (RFM_Score >= 4.5) return '優良顧客';
  if (RFM_Score >= 3.5) return '有望顧客';
  if (R_Score <= 2) return '休眠顧客';
  if (F_Score === 1 && M_Score >= 4) return '新規優良顧客';
  if (F_Score === 1) return '新規顧客';
  return '一般顧客';
}

/**
 * RFM分析を実行し、顧客をセグメント分類
 */
export function calculateRFMSegmentation(
  data: PurchaseRecord[],
  snapshotDate: Date = new Date()
): RFMResult[] {
  // 顧客別にRFM指標を計算
  const customerRFM = _(data)
    .groupBy('顧客ID')
    .map((records, 顧客ID) => {
      const sortedDates = _.orderBy(records, '購入日', 'desc');
      const latestPurchase = sortedDates[0].購入日;

      return {
        顧客ID,
        Recency: differenceInDays(snapshotDate, latestPurchase),
        Frequency: records.length,
        Monetary: _.sumBy(records, '購入金額'),
      };
    })
    .value();

  // 四分位数を計算
  const recencyValues = customerRFM.map((c) => c.Recency).sort((a, b) => a - b);
  const frequencyValues = customerRFM.map((c) => c.Frequency).sort((a, b) => a - b);
  const monetaryValues = customerRFM.map((c) => c.Monetary).sort((a, b) => a - b);

  const getQuartiles = (values: number[]) => {
    const n = values.length;
    return [
      values[Math.floor(n * 0.2)],
      values[Math.floor(n * 0.4)],
      values[Math.floor(n * 0.6)],
      values[Math.floor(n * 0.8)],
    ];
  };

  const rQuartiles = getQuartiles(recencyValues);
  const fQuartiles = getQuartiles(frequencyValues);
  const mQuartiles = getQuartiles(monetaryValues);

  // スコアリング
  const scoredCustomers: RFMResult[] = customerRFM.map((customer) => {
    const R_Score = calculateScore(customer.Recency, rQuartiles, true);
    const F_Score = calculateScore(customer.Frequency, fQuartiles);
    const M_Score = calculateScore(customer.Monetary, mQuartiles);
    const RFM_Score = (R_Score + F_Score + M_Score) / 3;

    return {
      ...customer,
      R_Score,
      F_Score,
      M_Score,
      RFM_Score,
      顧客セグメント: '',
    };
  });

  // セグメント分類
  return scoredCustomers.map((customer) => ({
    ...customer,
    顧客セグメント: classifyRFMSegment(customer),
  }));
}

/**
 * RFMセグメント別のサマリー統計を計算
 */
export function getRFMSummary(rfmResults: RFMResult[]) {
  const summary = _(rfmResults)
    .groupBy('顧客セグメント')
    .map((records, segment) => ({
      セグメント: segment,
      顧客数: records.length,
      総購入金額: _.sumBy(records, 'Monetary'),
      平均RFMスコア: _.meanBy(records, 'RFM_Score'),
    }))
    .orderBy('平均RFMスコア', 'desc')
    .value();

  return summary;
}
