# AI Chatbot

Claude APIを活用した汎用的な会話型AIチャットボット。Next.js App Routerで構築され、モダンな技術スタックを使用しています。

## 📚 技術スタック

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Prisma
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel

## ✨ 主な機能

- ✅ リアルタイムチャット（ストリーミングレスポンス）
- ✅ 会話履歴の永続化（MongoDB）
- ✅ レスポンシブデザイン（モバイル/タブレット/デスクトップ対応）
- ✅ ダークモード対応
- ✅ 日本語UI
- ✅ TypeScriptによる型安全な開発

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ai_chatbot?retryWrites=true&w=majority"

# Anthropic Claude API
ANTHROPIC_API_KEY="your-api-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

#### MongoDB Atlasのセットアップ

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウントを作成
2. 新しいクラスターを作成（無料のM0 Sandboxでも可）
3. Database Access でデータベースユーザーを作成
4. Network Access で接続元IPアドレスを設定（開発時は `0.0.0.0/0` でも可）
5. Connect → Drivers → 接続文字列をコピーして `DATABASE_URL` に設定

#### Anthropic APIキーの取得

1. [Anthropic Console](https://console.anthropic.com/) でアカウントを作成
2. API Keys セクションで新しいAPIキーを生成
3. 生成されたキーを `ANTHROPIC_API_KEY` に設定

### 3. Prismaクライアントの生成

```bash
npx prisma generate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 📁 プロジェクト構造

```
ai_chatbot/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── chat/         # チャットページ
│   │   └── layout.tsx    # ルートレイアウト
│   ├── components/       # Reactコンポーネント
│   │   ├── ui/           # shadcn/uiコンポーネント
│   │   ├── chat/         # チャット関連コンポーネント
│   │   └── theme/        # テーマ関連コンポーネント
│   ├── lib/              # ユーティリティ関数
│   │   ├── prisma.ts     # Prismaクライアント
│   │   ├── claude.ts     # Claude APIクライアント
│   │   └── utils.ts      # ヘルパー関数
│   └── types/            # TypeScript型定義
├── prisma/
│   └── schema.prisma     # データベーススキーマ
└── public/               # 静的ファイル
```

## 🛠️ 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバーを起動
npm run start

# ESLintチェック
npm run lint

# Prismaクライアントを生成
npx prisma generate

# Prisma Studio（データベースGUI）を起動
npx prisma studio
```

## 📝 使用方法

1. アプリケーションを起動すると、自動的にチャット画面にリダイレクトされます
2. 下部の入力フィールドにメッセージを入力して送信ボタンをクリック
3. Claude AIがリアルタイムで応答を返します
4. 会話履歴は自動的にMongoDBに保存されます
5. 右上のボタンでダークモード/ライトモードを切り替えられます

## 🐛 トラブルシューティング

### データベース接続エラー

- `DATABASE_URL` が正しく設定されているか確認
- MongoDB Atlasのネットワークアクセス設定を確認
- データベースユーザーの認証情報を確認

### Claude APIエラー

- `ANTHROPIC_API_KEY` が正しく設定されているか確認
- APIキーの使用制限を確認
- Anthropicコンソールでクレジットを確認

### ビルドエラー

```bash
# node_modulesとキャッシュを削除して再インストール
rm -rf node_modules .next
npm install
npx prisma generate
npm run dev
```

## 📄 ライセンス

MIT License

---

**開発者:** Claude Code を使用して構築
**作成日:** 2026年1月2日
