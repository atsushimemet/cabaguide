# Supabase データベースセットアップ

このディレクトリには、Supabaseデータベースのセットアップに必要なSQLスクリプトが含まれています。

## セットアップ手順

1. Supabaseプロジェクトを作成
   - [Supabase](https://supabase.com)にアクセスしてプロジェクトを作成

2. SQL Editorでスクリプトを実行
   - Supabaseダッシュボードの「SQL Editor」を開く
   - 以下の順序でスクリプトを実行：

### 1. スキーマ作成
```sql
-- schema.sql の内容をコピーして実行
```

### 2. RLS設定
```sql
-- rls.sql の内容をコピーして実行
```

### 3. 初期データ投入
```sql
-- seed.sql の内容をコピーして実行
```

## テーブル構成

- `areas`: エリア情報
- `shops`: 店舗情報
- `shop_prices_time`: 店舗の時間帯別料金
- `shop_prices_nomination`: 店舗の指名料
- `shop_tax`: 店舗の税設定
- `casts`: キャスト情報
- `reviews`: 口コミ情報
- `likes`: いいね情報

## RLS (Row Level Security)

- 一般ユーザー: すべてのデータを閲覧可能、いいね・口コミ投稿可能
- 認証済みユーザー（管理者）: データの追加・更新・削除が可能

## 注意事項

- 管理者権限の制御は、Supabase Authのメタデータを使用して実装することを推奨します
- 本番環境では、より厳密な権限管理を実装してください
