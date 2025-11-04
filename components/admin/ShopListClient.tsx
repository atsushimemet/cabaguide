'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Area {
  id: string
  name: string
  prefecture: string
  city: string
}

interface Shop {
  id: string
  name: string
  area_id: string
  address: string | null
  phone: string | null
  website: string | null
  areas: Area
}

interface ShopListClientProps {
  initialShops: Shop[]
  areas: Area[]
}

export default function ShopListClient({
  initialShops,
  areas,
}: ShopListClientProps) {
  const [shops, setShops] = useState(initialShops)

  // Update state when initialShops changes, but only if the count differs significantly
  // This prevents overwriting local state updates with stale server data
  useEffect(() => {
    // Only update if the server data has more items (likely a new item was added server-side)
    // or if the count is significantly different
    if (initialShops.length > shops.length || Math.abs(initialShops.length - shops.length) > 1) {
      setShops(initialShops)
    }
  }, [initialShops])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    area_id: '',
    address: '',
    phone: '',
    website: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleOpenModal = (shop?: Shop) => {
    if (shop) {
      setEditingShop(shop)
      setFormData({
        name: shop.name,
        area_id: shop.area_id,
        address: shop.address || '',
        phone: shop.phone || '',
        website: shop.website || '',
      })
    } else {
      setEditingShop(null)
      setFormData({
        name: '',
        area_id: '',
        address: '',
        phone: '',
        website: '',
      })
    }
    setIsModalOpen(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingShop(null)
    setFormData({
      name: '',
      area_id: '',
      address: '',
      phone: '',
      website: '',
    })
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingShop
        ? `/api/admin/shops/${editingShop.id}`
        : '/api/admin/shops'
      const method = editingShop ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          address: formData.address || null,
          phone: formData.phone || null,
          website: formData.website || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'エラーが発生しました')
      }

      const data = await response.json()
      console.log('Shop response data:', data)

      if (editingShop) {
        // Update existing shop in local state
        setShops((prevShops) =>
          prevShops.map((shop) => (shop.id === editingShop.id ? data : shop))
        )
      } else {
        // Add new shop to local state
        setShops((prevShops) => {
          // Check if shop already exists to avoid duplicates
          if (prevShops.some((shop) => shop.id === data.id)) {
            return prevShops
          }
          return [...prevShops, data]
        })
      }

      // Don't call router.refresh() immediately to avoid overwriting local state
      // The state will be synced when user navigates away and back
      
      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この店舗を削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/shops/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      // Update local state immediately
      setShops((prevShops) => prevShops.filter((shop) => shop.id !== id))
      
      // Refresh server data after a short delay
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">店舗一覧</h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              新規追加
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    店舗名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    エリア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.map((shop) => (
                  <tr key={shop.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop.areas?.prefecture}・{shop.areas?.city}・{shop.areas?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/shops/${shop.id}/prices`}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        料金設定
                      </Link>
                      <button
                        onClick={() => handleOpenModal(shop)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(shop.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCloseModal}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingShop ? '店舗編集' : '店舗追加'}
                  </h3>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        店舗名
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="area_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        エリア
                      </label>
                      <select
                        id="area_id"
                        required
                        value={formData.area_id}
                        onChange={(e) =>
                          setFormData({ ...formData, area_id: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.prefecture}・{area.city}・{area.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        住所（任意）
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        電話番号（任意）
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ウェブサイト（任意）
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                  >
                    {isSubmitting ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
