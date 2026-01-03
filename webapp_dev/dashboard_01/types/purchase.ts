export interface PurchaseRecord {
  顧客ID: string;
  年齢: number;
  性別: '男性' | '女性';
  地域: '関東' | '関西' | '中部' | '九州';
  購入カテゴリー: 'スポーツ' | '家電' | '食品' | 'ファッション' | '書籍';
  購入金額: number;
  購入日: Date;
  支払方法: 'クレジットカード' | '電子マネー' | '現金';
  // 派生フィールド
  年齢層?: '20代以下' | '30代' | '40代' | '50代' | '60代以上';
  購入月?: string; // YYYY-MM形式
}

export type Region = '関東' | '関西' | '中部' | '九州';
export type Category = 'スポーツ' | '家電' | '食品' | 'ファッション' | '書籍';
export type Gender = '男性' | '女性';
export type PaymentMethod = 'クレジットカード' | '電子マネー' | '現金';
export type AgeGroup = '20代以下' | '30代' | '40代' | '50代' | '60代以上';
