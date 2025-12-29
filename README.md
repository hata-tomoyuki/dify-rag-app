This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# データベース接続（開発環境）
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# Vercel Postgres使用時は自動設定される（POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING）

# OpenAI API
OPENAI_API_KEY=sk-...

# NextAuth設定
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000
```

`AUTH_SECRET`は以下のコマンドで生成できます：
```bash
openssl rand -base64 32
```

### データベースのセットアップ

```bash
# マイグレーションの実行
npx prisma migrate dev

# Prismaクライアントの生成
npx prisma generate

# シードデータの投入（オプション）
npx prisma db seed
```

### 開発サーバーの起動

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### 1. Vercel Postgres を紐付け

1. Vercelのプロジェクト → **Storage** → Postgres作成/接続
2. 接続すると環境変数が自動で設定されます：
   - `POSTGRES_PRISMA_URL` (プール用URL)
   - `POSTGRES_URL_NON_POOLING` (直結URL)

### 2. 環境変数の設定

Vercelのプロジェクト設定 → **Environment Variables** で以下を設定：

```env
# OpenAI API（必須）
OPENAI_API_KEY=sk-...

# NextAuth設定（必須）
AUTH_SECRET=your-secret-key-here  # openssl rand -base64 32 で生成
AUTH_URL=https://your-domain.vercel.app

# データベース接続（Vercel Postgres接続時に自動設定される）
# POSTGRES_PRISMA_URL=... (自動設定、プール用URL)
# POSTGRES_URL_NON_POOLING=... (自動設定、マイグレーション用直結URL)
```

### 3. デプロイ時のマイグレーション

`package.json`の`vercel-build`スクリプトにより、デプロイ時に自動でマイグレーションが実行されます：

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

これにより、本番環境に未適用のマイグレーションがあれば自動で適用されます。

**重要**: `prisma migrate deploy`は**seedを自動実行しません**。シードデータは初回のみ手動で実行してください。

### 4. シードデータの投入（初回のみ）

**重要**: シードスクリプトは`deleteMany()`を使用しているため、毎回実行すると本番データが消えます。

#### 方法A: 手動実行（推奨）

本番DBの接続文字列を使ってローカルから1回だけ実行：

```bash
# 本番DBの接続文字列を環境変数に設定
export DATABASE_URL="postgresql://..."
export POSTGRES_URL_NON_POOLING="postgresql://..."

# シード実行
npx prisma db seed
```

#### 方法B: 管理者専用API（オプション）

必要に応じて、管理者専用のシード実行APIを作成することも可能です。

### 5. pgvector拡張について

pgvector拡張は既にマイグレーション（`20251228000000_enable_pgvector`）に含まれているため、自動で適用されます。

マイグレーションファイル（`prisma/migrations/20251228000000_enable_pgvector/migration.sql`）に以下が含まれています：

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

これにより、デプロイ時に自動でpgvector拡張が有効化されます。

### デプロイ手順のまとめ

1. GitHubにpush
2. VercelでImportしてデプロイ
3. StorageでVercel Postgresを接続（環境変数が自動設定）
4. 環境変数（`OPENAI_API_KEY`, `AUTH_SECRET`, `AUTH_URL`）を設定
5. デプロイが完了すると自動でマイグレーションが実行される
6. 初回のみ、手動でシードデータを投入

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
