# Vercelへのデプロイ手順

このドキュメントでは、キャバクラキャスト検索サービスをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（[https://vercel.com](https://vercel.com) で作成可能）
- Supabaseプロジェクト
- AWS S3バケット

## デプロイ手順

### 1. GitHubリポジトリの準備

プロジェクトがGitHubリポジトリにプッシュされていることを確認してください。

```bash
git remote -v
```

リモートリポジトリが設定されていない場合は、以下のコマンドで設定します：

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercelアカウントの作成・ログイン

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントでログイン
4. VercelがGitHubリポジトリにアクセスする権限を許可

### 3. プロジェクトのインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から `cabaguide` を選択
3. 「Import」をクリック

### 4. プロジェクト設定

Vercelが自動的にNext.jsプロジェクトを検出します。以下の設定を確認・変更してください：

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `./`（デフォルト）
- **Build Command**: `npm run build`（自動検出）
- **Output Directory**: `.next`（自動検出）
- **Install Command**: `npm install`（自動検出）

### 5. 環境変数の設定

「Environment Variables」セクションで以下の環境変数を設定します：

#### Supabase設定

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### AWS S3設定

```
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

#### アプリケーション設定

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**注意**: `NEXT_PUBLIC_APP_URL`は最初のデプロイ後、Vercelが自動的に割り当てたURLに更新してください。

### 6. 環境変数の環境設定

各環境変数に対して、どの環境で使用するかを設定します：

- **Production**: ✅（本番環境）
- **Preview**: ✅（プレビュー環境）
- **Development**: ✅（開発環境、必要に応じて）

### 7. デプロイの実行

1. 「Deploy」ボタンをクリック
2. ビルドプロセスが開始されます（通常2-3分）
3. デプロイが完了すると、自動的にURLが生成されます

### 8. デプロイ後の確認

#### デプロイURLの確認

デプロイが完了すると、以下のようなURLが表示されます：

```
https://cabaguide-xxxxx.vercel.app
```

#### 動作確認

1. 生成されたURLにアクセスして、トップページが表示されることを確認
2. エリア選択が動作することを確認
3. 管理者ログイン（`/admin-login`）が動作することを確認

## 追加設定

### カスタムドメインの設定

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Domains」をクリック
3. カスタムドメインを追加
4. DNS設定を行い、Vercelが指定するレコードを設定

### 環境変数の更新

環境変数を更新する場合：

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」をクリック
3. 環境変数を追加・編集・削除
4. 変更後、再デプロイが必要です

## トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数が設定されていない**
   - すべての環境変数が正しく設定されているか確認
   - 特に`NEXT_PUBLIC_`で始まる変数はクライアント側でも使用されるため必須

2. **Supabase接続エラー**
   - `NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`が正しいか確認
   - Supabaseプロジェクトの設定でAPI URLと匿名キーを確認

3. **AWS S3接続エラー**
   - AWS認証情報が正しいか確認
   - IAMユーザーにS3への適切な権限が付与されているか確認
   - バケット名とリージョンが正しいか確認

### デプロイが成功してもページが表示されない場合

1. **Browser Consoleの確認**
   - ブラウザの開発者ツールでエラーを確認
   - 環境変数が正しく読み込まれているか確認

2. **Vercelのログ確認**
   - Vercelダッシュボードの「Deployments」タブでログを確認
   - ランタイムエラーがないか確認

### 画像が表示されない場合

1. **S3バケットのCORS設定確認**
   - S3バケットのCORS設定でVercelドメインからのアクセスを許可
   - 設定例：
     ```json
     [
       {
         "AllowedHeaders": ["*"],
         "AllowedMethods": ["GET", "HEAD"],
         "AllowedOrigins": ["https://your-app.vercel.app", "https://*.vercel.app"],
         "ExposeHeaders": []
       }
     ]
     ```

2. **デフォルト画像の確認**
   - `public/default-cast.png`が存在するか確認
   - 画像ファイルが正しくコミットされているか確認

## 自動デプロイ

### GitHub連携

VercelはGitHubと連携しており、以下の場合に自動的にデプロイされます：

- `main`ブランチへのプッシュ → Production環境にデプロイ
- その他のブランチへのプッシュ → Preview環境にデプロイ
- Pull Requestの作成 → Preview環境にデプロイ

### デプロイ通知

- Vercelダッシュボードでデプロイ状況を確認
- GitHubのコミットにデプロイステータスが表示されます
- メール通知を有効にすることも可能

## パフォーマンス最適化

### Next.js設定

`next.config.js`で以下の設定を確認：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
    // または
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
```

### 環境変数の最適化

- `NEXT_PUBLIC_`で始まる変数はビルド時に埋め込まれるため、必要最小限に
- 機密情報は`NEXT_PUBLIC_`プレフィックスを付けない

## セキュリティ

### 環境変数の管理

- 機密情報（`SUPABASE_SERVICE_ROLE_KEY`、`AWS_SECRET_ACCESS_KEY`など）はVercelの環境変数として管理
- `.env.local`などのローカルファイルはGitにコミットしない（`.gitignore`に追加済み）

### Supabase RLS設定

- データベースのRow Level Security（RLS）が適切に設定されているか確認
- 管理者用のAPIは適切に認証されているか確認

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

## サポート

問題が発生した場合は、以下を確認してください：

1. Vercelのデプロイログ
2. ブラウザのコンソールエラー
3. Supabaseのログ
4. AWS CloudWatchのログ（S3アクセスログ）

