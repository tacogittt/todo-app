import Papa from 'papaparse';
import { format } from 'date-fns';
import type { PurchaseRecord, AgeGroup } from '@/types/purchase';

/**
 * 年齢から年齢層を取得
 */
function getAgeGroup(age: number): AgeGroup {
  if (age <= 29) return '20代以下';
  if (age <= 39) return '30代';
  if (age <= 49) return '40代';
  if (age <= 59) return '50代';
  return '60代以上';
}

/**
 * CSVの生データをPurchaseRecord型に変換し、派生フィールドを追加
 */
function enrichRecord(record: any): PurchaseRecord {
  const purchaseDate = new Date(record['購入日']);

  return {
    顧客ID: String(record['顧客ID']),
    年齢: Number(record['年齢']),
    性別: record['性別'],
    地域: record['地域'],
    購入カテゴリー: record['購入カテゴリー'],
    購入金額: Number(record['購入金額']),
    購入日: purchaseDate,
    支払方法: record['支払方法'],
    年齢層: getAgeGroup(Number(record['年齢'])),
    購入月: format(purchaseDate, 'yyyy-MM'),
  };
}

/**
 * CSVファイルを読み込み、パースしてPurchaseRecord配列を返す
 */
export async function loadPurchaseData(): Promise<PurchaseRecord[]> {
  const response = await fetch('/data/sample-data.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const records = results.data
            .filter((row) => row['顧客ID']) // 空行を除外
            .map(enrichRecord);
          resolve(records);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}
