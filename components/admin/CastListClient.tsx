'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Shop {
  id: string
  name: string
  areas: {
    id: string
    name: string
    prefecture: string
    city: string
  }
}

interface Cast {
  id: string
  name: string
  shop_id: string
  image_url: string | null
  instagram_url: string | null
  shops: Shop
}

interface CastListClientProps {
  initialCasts: Cast[]
  shops: Shop[]
}

const DEFAULT_IMAGE = '/default-cast.png'

export default function CastListClient({
  initialCasts,
  shops,
}: CastListClientProps) {
  const [casts, setCasts] = useState(initialCasts)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Update state when initialCasts changes, but only if the count differs significantly
  // This prevents overwriting local state updates with stale server data
  useEffect(() => {
    // Only update if the server data has more items (likely a new item was added server-side)
    // or if the count is significantly different
    if (initialCasts.length > casts.length || Math.abs(initialCasts.length - casts.length) > 1) {
      setCasts(initialCasts)
      // Reset image errors when casts are updated
      setImageErrors({})
    }
  }, [initialCasts.length, casts.length])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCast, setEditingCast] = useState<Cast | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    shop_id: '',
    instagram_url: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleOpenModal = (cast?: Cast) => {
    if (cast) {
      setEditingCast(cast)
      setFormData({
        name: cast.name,
        shop_id: cast.shop_id,
        instagram_url: cast.instagram_url || '',
      })
      setImagePreview(cast.image_url)
    } else {
      setEditingCast(null)
      setFormData({
        name: '',
        shop_id: '',
        instagram_url: '',
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCast(null)
    setFormData({
      name: '',
      shop_id: '',
      instagram_url: '',
    })
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let imageUrl = editingCast?.image_url || null

      // Upload image if new file is selected
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('castId', editingCast?.id || 'new')

        const uploadResponse = await fetch('/api/admin/casts/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const data = await uploadResponse.json()
          throw new Error(data.error || '画像のアップロードに失敗しました')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      const url = editingCast
        ? `/api/admin/casts/${editingCast.id}`
        : '/api/admin/casts'
      const method = editingCast ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          instagram_url: formData.instagram_url || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'エラーが発生しました')
      }

      const data = await response.json()
      console.log('Cast response data:', data)

      if (editingCast) {
        // Update existing cast in local state
        setCasts((prevCasts) =>
          prevCasts.map((cast) => (cast.id === editingCast.id ? data : cast))
        )
      } else {
        // Add new cast to local state
        setCasts((prevCasts) => {
          // Check if cast already exists to avoid duplicates
          if (prevCasts.some((cast) => cast.id === data.id)) {
            return prevCasts
          }
          return [...prevCasts, data]
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
    if (!confirm('このキャストを削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/casts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      // Update local state immediately
      setCasts((prevCasts) => prevCasts.filter((cast) => cast.id !== id))
      
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
            <h2 className="text-lg font-medium text-gray-900">キャスト一覧</h2>
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
                    画像
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    キャスト名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    店舗
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {casts.map((cast) => (
                  <tr key={cast.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 bg-gray-200 rounded">
                        {imageErrors[cast.id] ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded text-xs text-gray-500">
                            画像なし
                          </div>
                        ) : (
                          <Image
                            src={cast.image_url || DEFAULT_IMAGE}
                            alt={cast.name}
                            fill
                            className="object-cover rounded"
                            unoptimized={!cast.image_url || cast.image_url === DEFAULT_IMAGE}
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [cast.id]: true }))
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cast.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cast.shops?.areas?.prefecture}・{cast.shops?.areas?.city}・
                      {cast.shops?.areas?.name} - {cast.shops?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(cast)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(cast.id)}
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
                    {editingCast ? 'キャスト編集' : 'キャスト追加'}
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
                        キャスト名
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
                        htmlFor="shop_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        店舗
                      </label>
                      <select
                        id="shop_id"
                        required
                        value={formData.shop_id}
                        onChange={(e) =>
                          setFormData({ ...formData, shop_id: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        {shops.map((shop) => (
                          <option key={shop.id} value={shop.id}>
                            {shop.areas?.prefecture}・{shop.areas?.city}・
                            {shop.areas?.name} - {shop.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="instagram_url"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Instagram URL（任意）
                      </label>
                      <input
                        type="url"
                        id="instagram_url"
                        value={formData.instagram_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram_url: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        画像（任意）
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="mt-2 relative w-32 h-32 bg-gray-200 rounded">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      {!imagePreview && editingCast?.image_url && (
                        <div className="mt-2 relative w-32 h-32 bg-gray-200 rounded">
                          <Image
                            src={editingCast.image_url}
                            alt="Current"
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
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
