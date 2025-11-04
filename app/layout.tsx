import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'キャバクラキャスト検索',
  description: 'エリア別キャバクラキャスト検索サービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
