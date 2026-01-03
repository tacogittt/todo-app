# 顧客購買データ分析ダッシュボード

Next.js + Material-UI + Rechartsで構築したデータ分析ダッシュボードアプリケーション

## 技術スタック

- **フレームワーク:** Next.js 15 (App Router)
- **UIライブラリ:** React 19 + TypeScript 5
- **UIコンポーネント:** Material-UI (MUI) v6
- **チャート:** Recharts 2.15
- **データ処理:** PapaParse, date-fns, lodash

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run type-check

# Lint実行
npm run lint
```

## 機能

- 基本統計表示（総売上、顧客数、平均購入金額など）
- フィルタリング機能（地域、カテゴリー、性別、期間）
- 時系列分析（月別・年別推移）
- カテゴリー別・地域別集計
- ABC分析（パレート図）
- RFM分析（顧客セグメント分類）
- レスポンシブデザイン
- ダークモード対応

## ライセンス

MIT
