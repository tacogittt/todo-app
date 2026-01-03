export interface ABCResult {
  顧客ID: string;
  総購入金額: number;
  購入回数: number;
  ABCランク: 'A' | 'B' | 'C';
  累積売上比率: number;
}

export interface RFMResult {
  顧客ID: string;
  Recency: number;      // 最終購入からの日数
  Frequency: number;    // 購入回数
  Monetary: number;     // 総購入金額
  R_Score: number;      // 1-5
  F_Score: number;      // 1-5
  M_Score: number;      // 1-5
  RFM_Score: number;    // 平均スコア
  顧客セグメント: string;
}

export type RFMSegment =
  | '優良顧客'
  | '有望顧客'
  | '休眠顧客'
  | '新規優良顧客'
  | '新規顧客'
  | '一般顧客';

export interface MetricsSummary {
  総購入金額: number;
  購入件数: number;
  ユニーク顧客数: number;
  平均購入金額: number;
}

export interface TimeSeriesData {
  月: string;
  購入金額: number;
  件数: number;
  顧客数: number;
}

export interface CategoryData {
  カテゴリー: string;
  購入金額: number;
  件数: number;
}

export interface PurchaseFrequencyData {
  購入回数: number;
  顧客数: number;
  総購入金額: number;
  平均購入金額: number;
}

export interface PurchaseFrequencyResult {
  分布データ: PurchaseFrequencyData[];
  リピート率: number;
  新規顧客数: number;
  リピート顧客数: number;
  新規顧客売上: number;
  リピート顧客売上: number;
  平均購入回数: number;
}
