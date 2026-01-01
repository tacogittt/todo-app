# AI Chatbot 要件定義書

## 1. プロジェクト概要

### 1.1 目的
汎用的な会話型AIチャットボットを開発し、モダンなWeb技術スタックを学習する。

### 1.2 目標
- Claude APIを活用した高品質な対話システムの構築
- Next.js App Routerによるフルスタック開発の習得
- Mastra AIエージェントフレームワークの理解
- Prisma + MongoDBによるデータ永続化の実装
- レスポンシブでアクセシブルなUIの構築

### 1.3 対象ユーザー
- 日本語を主言語とする一般ユーザー
- モバイル・タブレット・デスクトップからアクセス可能
- 認証なしで誰でも利用可能

---

## 2. 技術スタック

### 2.1 フロントエンド
- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **状態管理**: React Hooks (useState, useEffect)
- **テーマ**: next-themes (ダークモード対応)

### 2.2 バックエンド
- **フレームワーク**: Hono (API routes)
- **ORM**: Prisma
- **データベース**: MongoDB
- **AI API**: Claude API (Anthropic)
- **AIフレームワーク**: Mastra

### 2.3 開発ツール
- **パッケージマネージャー**: npm
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **型チェック**: TypeScript Compiler

### 2.4 デプロイ
- **ホスティング**: Vercel
- **データベース**: MongoDB Atlas

---

## 3. 機能要件

### 3.1 コア機能

#### 3.1.1 チャット機能
- リアルタイムメッセージ送受信
- ストリーミングレスポンス（Claude APIからの応答を逐次表示）
- マークダウン形式のメッセージサポート
- コードブロックのシンタックスハイライト

#### 3.1.2 会話履歴管理
- 会話の永続化（MongoDB）
- 会話履歴の一覧表示
- 特定の会話の再開
- 会話の削除

#### 3.1.3 ユーザーインターフェース
- レスポンシブデザイン（モバイル/タブレット/デスクトップ）
- ダークモード/ライトモードの切り替え
- 日本語UI
- アクセシビリティ対応（ARIA属性、キーボードナビゲーション）

### 3.2 非機能要件

#### 3.2.1 パフォーマンス
- 初回ロード時間: 3秒以内
- メッセージ送信レスポンス: 1秒以内（ストリーミング開始まで）
- スムーズなスクロール・アニメーション

#### 3.2.2 セキュリティ
- API キーの適切な管理（環境変数）
- XSS対策（Reactのエスケープ機能）
- CSRF対策（Honoのミドルウェア）
- レート制限の実装

#### 3.2.3 可用性
- Vercelによる99.9%のアップタイム
- エラーハンドリングとフォールバック
- オフライン時のエラーメッセージ表示

---

## 4. データモデル

### 4.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Conversation {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  title     String?   // 会話のタイトル（最初のメッセージから自動生成）
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String       @db.ObjectId
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String       // "user" or "assistant"
  content        String       @db.String
  createdAt      DateTime     @default(now())

  @@index([conversationId])
}
```

### 4.2 データフロー

```
User Input → Frontend (React)
    ↓
POST /api/chat → Hono API Route
    ↓
Mastra Agent → Claude API
    ↓
Streaming Response → Frontend
    ↓
Save to MongoDB (Prisma) ← 会話履歴の保存
```

---

## 5. API設計

### 5.1 エンドポイント一覧

#### POST /api/chat
新しいメッセージを送信し、AIからの応答をストリーミングで受け取る。

**Request:**
```json
{
  "conversationId": "string | null",
  "message": "string"
}
```

**Response:**
- Server-Sent Events (SSE) によるストリーミング
- Content-Type: `text/event-stream`

**Stream Format:**
```
data: {"type": "start", "conversationId": "..."}
data: {"type": "content", "delta": "こんにちは"}
data: {"type": "content", "delta": "！"}
data: {"type": "done"}
```

#### GET /api/conversations
すべての会話履歴を取得。

**Response:**
```json
{
  "conversations": [
    {
      "id": "string",
      "title": "string",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601",
      "messageCount": "number"
    }
  ]
}
```

#### GET /api/conversations/:id
特定の会話とそのメッセージを取得。

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601",
  "messages": [
    {
      "id": "string",
      "role": "user | assistant",
      "content": "string",
      "createdAt": "ISO 8601"
    }
  ]
}
```

#### DELETE /api/conversations/:id
会話を削除。

**Response:**
```json
{
  "success": true,
  "message": "会話を削除しました"
}
```

---

## 6. UI/UXデザイン

### 6.1 画面構成

#### 6.1.1 チャット画面 (`/chat`)
```
┌─────────────────────────────────────────┐
│ Header                                   │
│ [Logo] AI Chatbot         [Theme] [Menu]│
├─────────────────────────────────────────┤
│ Sidebar (Desktop)  │ Chat Area          │
│                    │                    │
│ 会話履歴           │ Message Bubbles    │
│ - 会話1            │ ┌─User Message──┐  │
│ - 会話2            │ └───────────────┘  │
│ - 会話3            │ ┌─AI Response───┐  │
│                    │ └───────────────┘  │
│                    │                    │
│                    │ Input Area         │
│                    │ [────────] [送信] │
└─────────────────────────────────────────┘
```

#### 6.1.2 モバイルレイアウト
- ハンバーガーメニューでサイドバーを表示
- フルスクリーンチャットエリア
- 下部固定の入力フィールド

### 6.2 カラースキーム

#### ライトモード
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Primary: `#2563EB` (Blue)
- Text: `#1F2937`
- Border: `#E5E7EB`

#### ダークモード
- Background: `#0F172A`
- Surface: `#1E293B`
- Primary: `#3B82F6` (Blue)
- Text: `#F1F5F9`
- Border: `#334155`

### 6.3 タイポグラフィ
- **フォント**: システムフォント（sans-serif）
- **見出し**: 1.5rem / 2rem (font-bold)
- **本文**: 1rem (font-normal)
- **コード**: monospace (JetBrains Mono推奨)

---

## 7. 開発フェーズ

### Phase 1: プロジェクトセットアップ (Week 1)
- [ ] Next.js プロジェクト初期化
- [ ] TypeScript, ESLint, Prettier 設定
- [ ] Tailwind CSS + shadcn/ui セットアップ
- [ ] Git リポジトリ作成
- [ ] Prisma + MongoDB 接続設定

### Phase 2: 基本UI実装 (Week 1-2)
- [ ] レイアウトコンポーネント作成
- [ ] チャット画面のUI実装
- [ ] メッセージバブルコンポーネント
- [ ] 入力フォームコンポーネント
- [ ] ダークモード実装

### Phase 3: API統合 (Week 2-3)
- [ ] Hono API routes セットアップ
- [ ] Claude API クライアント実装
- [ ] Mastra エージェント設定
- [ ] ストリーミングレスポンス実装
- [ ] エラーハンドリング

### Phase 4: データベース統合 (Week 3)
- [ ] Prisma スキーマ定義
- [ ] 会話履歴保存機能
- [ ] 会話一覧表示
- [ ] 会話削除機能

### Phase 5: レスポンシブ対応 (Week 4)
- [ ] モバイルレイアウト最適化
- [ ] タブレット対応
- [ ] サイドバーのトグル機能
- [ ] アクセシビリティ改善

### Phase 6: デプロイ・最適化 (Week 4-5)
- [ ] Vercel デプロイ設定
- [ ] 環境変数設定
- [ ] パフォーマンス最適化
- [ ] SEO対策
- [ ] エラートラッキング設定

---

## 8. 環境変数

```bash
# .env.local

# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai_chatbot?retryWrites=true&w=majority"

# Anthropic Claude API
ANTHROPIC_API_KEY="sk-ant-api03-..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Optional: Rate Limiting
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="60000"
```

---

## 9. テスト戦略

### 9.1 単体テスト
- React コンポーネントのテスト（Jest + React Testing Library）
- API routes のテスト
- Utility 関数のテスト

### 9.2 統合テスト
- フロントエンドとバックエンドの統合
- データベース操作のテスト

### 9.3 E2Eテスト
- Playwright による主要フローのテスト
- チャット送受信フロー
- 会話履歴管理フロー

---

## 10. パフォーマンス最適化

### 10.1 フロントエンド
- コンポーネントの遅延読み込み（React.lazy）
- 画像の最適化（next/image）
- バンドルサイズの削減

### 10.2 バックエンド
- データベースクエリの最適化（インデックス）
- キャッシング戦略（Redis - 将来的に）
- レート制限の実装

### 10.3 ネットワーク
- CDN の活用（Vercel Edge Network）
- ストリーミングレスポンスによるUX向上
- HTTP/2 による多重化

---

## 11. セキュリティ考慮事項

### 11.1 API キー管理
- 環境変数による秘密情報の管理
- `.env` ファイルの `.gitignore` 登録
- Vercel 環境変数での本番設定

### 11.2 入力検証
- ユーザー入力のサニタイゼーション
- 最大文字数制限
- XSS 対策（React のデフォルト動作）

### 11.3 レート制限
- IP ベースのレート制限
- セッションベースの制限
- DDoS 対策

---

## 12. 将来的な拡張機能

### 12.1 短期（1-3ヶ月）
- [ ] ユーザー認証機能（NextAuth.js）
- [ ] マルチモーダル対応（画像アップロード）
- [ ] エクスポート機能（PDF, Markdown）
- [ ] 会話の共有機能

### 12.2 中期（3-6ヶ月）
- [ ] カスタムプロンプト設定
- [ ] モデル選択機能（Claude Opus/Sonnet/Haiku）
- [ ] プラグインシステム
- [ ] 音声入出力

### 12.3 長期（6ヶ月以降）
- [ ] マルチテナント対応
- [ ] チーム機能
- [ ] 分析ダッシュボード
- [ ] API 提供

---

## 13. 成功指標

### 13.1 技術指標
- ページロード時間 < 3秒
- API レスポンス時間 < 1秒
- エラーレート < 1%
- Lighthouse スコア > 90

### 13.2 学習目標
- Next.js App Router の実践的理解
- TypeScript による型安全な開発
- Claude API の効果的な活用
- フルスタック開発のワークフロー習得

---

## 14. リファレンス

### 14.1 ドキュメント
- [Next.js Documentation](https://nextjs.org/docs)
- [Claude API Documentation](https://docs.anthropic.com/)
- [Mastra Documentation](https://mastra.ai/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Hono Documentation](https://hono.dev/)

### 14.2 参考プロジェクト
- Vercel AI Chatbot Template
- shadcn/ui Chat Examples
- Next.js App Router Examples

---

## 15. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|-----------|---------|-------|
| 2026-01-02 | 1.0.0 | 初版作成 | Claude |

---

**文書承認**
- 作成日: 2026年1月2日
- 最終更新: 2026年1月2日
- ステータス: 承認待ち
