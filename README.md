# cabaguide

キャバクラキャスト検索サービス

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- AWS S3 (画像ストレージ)
- Vercel (ホスティング)

## セットアップ

1. 依存関係のインストール

```bash
npm install
```

2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成し、必要な値を設定してください。

```bash
cp .env.local.example .env.local
```

3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 環境変数

- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー（管理者用）
- `AWS_ACCESS_KEY_ID`: AWSアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットアクセスキー
- `AWS_REGION`: AWSリージョン
- `AWS_S3_BUCKET_NAME`: S3バケット名
- `NEXT_PUBLIC_APP_URL`: アプリケーションのURL

## データベースセットアップ

Supabaseデータベースのセットアップは `supabase/` ディレクトリを参照してください。

1. `supabase/schema.sql` を実行してテーブルを作成
2. `supabase/rls.sql` を実行してRLSポリシーを設定
3. `supabase/seed.sql` を実行して初期エリアデータを投入

## デフォルト画像

`public/default-cast.png` にデフォルト画像を配置してください。現在はプレースホルダーファイルが配置されています。

## 機能

### 一般ユーザー向け
- エリア選択
- エリア別キャスト一覧表示（10件）
- キャスト詳細表示
- いいね機能（IPベース）
- 口コミ投稿機能（3つの星評価 + コメント）

### 管理者向け
- Magic Link認証
- エリア管理（追加・編集・削除）
- 店舗管理（追加・編集・削除）
- 店舗料金管理（時間帯別料金、指名料、税設定）
- キャスト管理（追加・編集・削除、画像アップロード）

## 料金計算ロジック

店舗の時間帯別料金から1時間あたりの最安値・最大値を算出し、指名料を加算後、サービスチャージ・税込み率を適用して料金目安を計算します。
