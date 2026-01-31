# 習慣化支援PWAアプリ

Material Design 3を採用した習慣トラッキングPWAアプリ（Android対応）

## 技術スタック

- **バックエンド**: Laravel 12 + PHP 8.3
- **データベース**: SQLite
- **フロントエンド**: Tailwind CSS + Material Design 3
- **PWA**: laravelpwa
- **テスト**: PHPUnit（TDD方式）

## 特徴

✅ Material Design 3準拠のUIコンポーネント
✅ PWA対応（ホーム画面への追加可能）
✅ レスポンシブデザイン
✅ TDDで開発された再利用可能なコンポーネント
✅ Android実機で動作確認済み

## セットアップ

### 必要要件

- PHP 8.3+
- Composer 2.x
- Node.js 18+
- NPM

### インストール

```bash
# 依存関係のインストール
composer install
npm install

# 環境設定
cp .env.example .env
php artisan key:generate

# データベース準備
touch database/database.sqlite
php artisan migrate

# アセットビルド
npm run build
```

### 開発サーバー起動

```bash
# フロントエンドのビルド（開発モード）
npm run dev

# Laravelサーバー起動
php artisan serve
```

http://localhost:8000 でアクセス

## Android実機テスト

### WiFi経由でのテスト

1. PCのIPアドレスを確認:
   ```bash
   ipconfig
   ```

2. Laravelサーバーを外部アクセス可能で起動:
   ```bash
   php artisan serve --host=0.0.0.0
   ```

3. Android端末とPCを同じWiFiに接続

4. Android ChromeでアクセスしてPWAインストール:
   ```
   http://[PCのIPアドレス]:8000
   ```

### PWA機能確認

- ✅ ホーム画面への追加
- ✅ Material Designテーマカラー
- ✅ オフライン対応（Service Worker）
- ⚠️ スタンドアロン表示（HTTPS環境で完全動作）

## コンポーネント

### 基礎コンポーネント

- `<x-button>` - Material Design ボタン（filled/outlined/text）
- `<x-card>` - カード（elevated/filled/outlined）
- `<x-input>` - テキストフィールド

### アプリ固有コンポーネント

- `<x-habit-card>` - 習慣トラッキングカード（ストリーク表示付き）
- `<x-app-bar>` - アプリバー

## テスト

```bash
# 全テスト実行
php artisan test

# コンポーネントテストのみ
php artisan test --filter Components
```

## プロジェクト構成

```
PWA_app/
├── app/
│   └── Http/Controllers/
│       └── HabitController.php
├── resources/
│   ├── css/
│   │   └── app.css
│   └── views/
│       ├── components/
│       │   ├── app-bar.blade.php
│       │   ├── button.blade.php
│       │   ├── card.blade.php
│       │   ├── habit-card.blade.php
│       │   └── input.blade.php
│       └── home.blade.php
├── tests/
│   └── Feature/
│       └── Components/
│           ├── ComponentTestCase.php
│           ├── AppBarComponentTest.php
│           ├── ButtonComponentTest.php
│           ├── CardComponentTest.php
│           ├── HabitCardComponentTest.php
│           └── InputComponentTest.php
├── docs/
│   └── plans/
│       └── 2026-01-31-material-design-pwa-implementation.md
├── config/
│   └── laravelpwa.php
└── tailwind.config.js
```

## 実装済み機能

- ✅ Material Design 3コンポーネントライブラリ
- ✅ PWA基盤（manifest.json, Service Worker）
- ✅ レスポンシブUIデザイン
- ✅ 習慣リスト表示
- ✅ ストリーク（連続日数）バッジ
- ✅ 完了状態の視覚表現

## 今後の拡張予定

1. **データベース統合**
   - Habitモデルとマイグレーション
   - データの永続化

2. **CRUD操作**
   - 習慣の追加・編集・削除
   - チェックボックスの機能実装

3. **高度なPWA機能**
   - Webプッシュ通知
   - App Badge API統合
   - 完全なオフライン対応

4. **統計機能**
   - カレンダービュー
   - 進捗トラッキング
   - 達成率の可視化

## 開発方針

このプロジェクトはTDD（テスト駆動開発）で構築されています：
1. テストを先に書く（Red）
2. 実装してテストをパスさせる（Green）
3. リファクタリング（Refactor）

すべてのコンポーネントにはPHPUnitテストが含まれています。

## ライセンス

MIT

## 参考資料

- [Material Design 3](https://m3.material.io/)
- [Laravel Documentation](https://laravel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [laravelpwa](https://github.com/ladumor/laravel-pwa)
