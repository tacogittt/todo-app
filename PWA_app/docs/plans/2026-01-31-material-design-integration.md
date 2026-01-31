# Material Design 公式トークン使用によるPWAアプリUI実装設計

**作成日**: 2026-01-31
**対象プロジェクト**: 習慣化支援PWAアプリ（Android・プロトタイプ版）

## 設計概要

当初はFigma MCP連携によるデザインからコード生成を検討したが、Figma APIトークン生成にDEVモード（有償）が必要と判明。要件定義書の「追加費用ゼロ」制約を満たすため、**Material Design公式トークンを直接使用する方式に変更**。

## アーキテクチャ

### システム構成

```
Material Design 公式サイト
        ↓ (手動取得)
tailwind.config.js (デザイントークン)
        ↓
Tailwind CSS
        ↓
Bladeコンポーネント
```

### 技術スタック

- **バックエンド**: Laravel 12 + PHP 8.3
- **データベース**: SQLite
- **PWA**: laravelpwa パッケージ
- **CSS**: Tailwind CSS + Material Design トークン
- **フォント**: Roboto（Material Design標準）

## デザイントークン設定

### tailwind.config.js

```javascript
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 カラーシステム
        primary: '#6750A4',           // Primary40
        'on-primary': '#FFFFFF',      // OnPrimary100
        'primary-container': '#EADDFF', // PrimaryContainer90
        'on-primary-container': '#21005D', // OnPrimaryContainer10

        secondary: '#625B71',         // Secondary40
        'on-secondary': '#FFFFFF',
        'secondary-container': '#E8DEF8',

        tertiary: '#7D5260',
        'on-tertiary': '#FFFFFF',

        error: '#B3261E',
        'on-error': '#FFFFFF',

        background: '#FEF7FF',        // Background (light)
        'on-background': '#1D1B20',

        surface: '#FEF7FF',
        'on-surface': '#1D1B20',
        'surface-variant': '#E7E0EC',
        'on-surface-variant': '#49454F',

        outline: '#79747E',
        'outline-variant': '#CAC4D0',
      },

      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },

      fontSize: {
        // Material Design タイポグラフィスケール
        'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
        'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
        'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],

        'headline-large': ['32px', { lineHeight: '40px', fontWeight: '400' }],
        'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '400' }],
        'headline-small': ['24px', { lineHeight: '32px', fontWeight: '400' }],

        'title-large': ['22px', { lineHeight: '28px', fontWeight: '400' }],
        'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],

        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],

        'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },

      spacing: {
        // Material Design スペーシング（4dpグリッド）
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },

      borderRadius: {
        // Material Design 形状システム
        'none': '0px',
        'xs': '4px',      // Extra small
        'sm': '8px',      // Small
        'md': '12px',     // Medium
        'lg': '16px',     // Large
        'xl': '28px',     // Extra large
        'full': '9999px', // Full (pills, chips)
      },
    },
  },
  plugins: [],
}
```

## コンポーネント生成戦略

### Phase 1: 基礎コンポーネント

#### 1. Button (button.blade.php)

**バリエーション:**
- Filled Button（Primary action）
- Outlined Button（Secondary action）
- Text Button（Tertiary action）

**実装ポイント:**
- 最小タップ領域: 44px × 44px（Android推奨）
- 状態: Default, Hover, Focus, Pressed, Disabled
- アイコン対応（オプション）

#### 2. Card (card.blade.php)

**バリエーション:**
- Elevated Card（影付き）
- Filled Card（塗りつぶし）
- Outlined Card（枠線）

**実装ポイント:**
- Elevation（影の深さ）を Tailwind shadow で再現
- パディング: 16px（標準）

#### 3. Form Input (input.blade.php)

**バリエーション:**
- Text Field（Filled variant）
- Label, Helper text, Error state

**実装ポイント:**
- フォーカス時のアウトライン: 2px, primary色
- エラー時: error色、エラーメッセージ表示

### Phase 2: 習慣化専用コンポーネント

#### 4. Habit Tracker Card (habit-card.blade.php)

Card + チェックボックス + ストリーク表示を組み合わせ

#### 5. Progress Indicator (progress-bar.blade.php)

達成率の可視化（Linear Progress Indicator）

#### 6. Date Selector (date-selector.blade.php)

カレンダー風UI（将来的にカレンダービューで使用）

### Phase 3: レイアウトとナビゲーション

#### 7. App Bar (app-bar.blade.php)

トップバー（タイトル、メニュー、アクション）

#### 8. Bottom Navigation (bottom-nav.blade.php)

画面切り替え（3〜5項目）

#### 9. FAB - Floating Action Button (fab.blade.php)

習慣追加ボタン（画面右下に固定）

## プロジェクト構成

```
PWA_app/
├── tailwind.config.js          # Material Design トークン設定
├── resources/
│   ├── css/
│   │   └── app.css             # Tailwind directives
│   ├── views/
│   │   ├── components/         # Bladeコンポーネント
│   │   │   ├── button.blade.php
│   │   │   ├── card.blade.php
│   │   │   ├── input.blade.php
│   │   │   ├── habit-card.blade.php
│   │   │   ├── progress-bar.blade.php
│   │   │   ├── app-bar.blade.php
│   │   │   ├── bottom-nav.blade.php
│   │   │   └── fab.blade.php
│   │   └── pages/              # ページビュー
│   │       ├── home.blade.php
│   │       └── habits/
│   │           ├── index.blade.php
│   │           └── create.blade.php
├── tests/
│   └── Feature/
│       └── Components/         # コンポーネントテスト
├── public/
│   ├── manifest.json           # PWA manifest
│   └── service-worker.js       # Service Worker
└── docs/
    └── plans/
        └── 2026-01-31-material-design-integration.md
```

## テストと検証

### 開発環境テスト

```bash
php artisan serve
# http://localhost:8000
```

**検証項目:**
- Material Design準拠（色、タイポグラフィ、スペーシング）
- レスポンシブデザイン（Chrome DevTools モバイルビュー）
- Tailwind クラスの正しい適用

### Android実機テスト

**USBポートフォワーディング使用:**

```bash
# PCでサーバー起動
php artisan serve

# Android実機をUSB接続
# Chrome DevTools → Remote devices
# localhost:8000 をポートフォワーディング
```

**検証項目:**
- タップ領域の適切さ（44px以上）
- スクロールの滑らかさ
- Material Design アニメーション
- PWA manifest の動作確認

### 品質チェックリスト

- [ ] Material Design 3 カラーを使用
- [ ] Roboto フォントを適用
- [ ] 4dp グリッドに沿ったスペーシング
- [ ] タップ領域 44px 以上
- [ ] 各状態（Hover, Focus, Pressed, Disabled）を実装
- [ ] Android実機で動作確認
- [ ] PWA としてインストール可能

## 実装方針

### TDD (Test-Driven Development)

各コンポーネントは以下の順序で実装：

1. **RED**: テストを書く（失敗を確認）
2. **GREEN**: 最小限のコードで通過
3. **REFACTOR**: リファクタリング

### Bladeコンポーネント仕様

```php
<!-- 使用例: button.blade.php -->
<x-button variant="filled" color="primary">
    習慣を追加
</x-button>

<!-- 使用例: habit-card.blade.php -->
<x-habit-card
    title="毎朝のランニング"
    streak="7日連続"
    :completed="false"
/>
```

## 参考リソース

- **Material Design 3**: https://m3.material.io/
- **Material Design Color System**: https://m3.material.io/styles/color/system/overview
- **Material Design Typography**: https://m3.material.io/styles/typography/overview
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs

## 変更履歴

- **2026-01-31**: 初版作成
  - Figma MCP連携から Material Design公式トークン使用へ変更
  - 理由: Figma APIトークン生成にDEVモード（有償）が必要
  - 結果: 要件定義書の「追加費用ゼロ」制約を満たす設計に
