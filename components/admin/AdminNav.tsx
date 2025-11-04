'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { path: '/admin', label: 'ダッシュボード' },
  { path: '/admin/areas', label: 'エリア管理' },
  { path: '/admin/shops', label: '店舗管理' },
  { path: '/admin/casts', label: 'キャスト管理' },
]

export default function AdminNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  const getLinkClasses = (path: string) => {
    const active = isActive(path)
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      active
        ? 'border-blue-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`
  }

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {menuItems.map((item) => (
        <Link key={item.path} href={item.path} className={getLinkClasses(item.path)}>
          {item.label}
        </Link>
      ))}
    </div>
  )
}
