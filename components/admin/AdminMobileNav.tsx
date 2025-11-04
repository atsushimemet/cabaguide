'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  { path: '/admin', label: 'ダッシュボード' },
  { path: '/admin/areas', label: 'エリア管理' },
  { path: '/admin/shops', label: '店舗管理' },
  { path: '/admin/casts', label: 'キャスト管理' },
]

export default function AdminMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(path)
  }

  const getCurrentLabel = () => {
    const current = menuItems.find((item) => isActive(item.path))
    return current ? current.label : 'メニューを選択'
  }

  const handleMobileSelect = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="sm:hidden border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <span>{getCurrentLabel()}</span>
              <svg
                className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${
                  isMobileMenuOpen ? 'transform rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="py-1">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleMobileSelect(item.path)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
