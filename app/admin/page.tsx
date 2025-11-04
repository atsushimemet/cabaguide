import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/areas"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">エリア管理</h2>
          <p className="text-gray-600">エリアの追加・編集・削除</p>
        </Link>
        <Link
          href="/admin/shops"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">店舗管理</h2>
          <p className="text-gray-600">店舗の追加・編集・削除</p>
        </Link>
        <Link
          href="/admin/casts"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">キャスト管理</h2>
          <p className="text-gray-600">キャストの追加・編集・削除</p>
        </Link>
      </div>
    </div>
  )
}
