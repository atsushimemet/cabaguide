'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface TimePrice {
  id: string
  start_time: string
  end_time: string
  price: number
}

interface NominationPrice {
  id: string
  price: number
}

interface Tax {
  id: string
  price: number
}

interface PriceManagementClientProps {
  shopId: string
  initialPrices: {
    timePrices: TimePrice[]
    nominationPrice: NominationPrice | null
    tax: Tax | null
  }
}

export default function PriceManagementClient({
  shopId,
  initialPrices,
}: PriceManagementClientProps) {
  const [timePrices, setTimePrices] = useState(initialPrices.timePrices)
  const [nominationPrice, setNominationPrice] = useState(
    initialPrices.nominationPrice?.price || 0
  )
  const [nominationPriceInput, setNominationPriceInput] = useState(
    initialPrices.nominationPrice?.price?.toString() || ''
  )
  const [taxRate, setTaxRate] = useState(
    initialPrices.tax?.price || 0.35
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState<TimePrice | null>(null)
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    price: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleOpenModal = (price?: TimePrice) => {
    if (price) {
      setEditingPrice(price)
      setFormData({
        start_time: price.start_time,
        end_time: price.end_time,
        price: price.price.toString(),
      })
    } else {
      setEditingPrice(null)
      setFormData({ start_time: '', end_time: '', price: '' })
    }
    setIsModalOpen(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPrice(null)
    setFormData({ start_time: '', end_time: '', price: '' })
    setError(null)
  }

  const handleSubmitTimePrice = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingPrice
        ? `/api/admin/shops/${shopId}/prices/time/${editingPrice.id}`
        : `/api/admin/shops/${shopId}/prices/time`
      const method = editingPrice ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_time: formData.start_time,
          end_time: formData.end_time,
          price: parseInt(formData.price),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'エラーが発生しました')
      }

      router.refresh()
      handleCloseModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTimePrice = async (id: string) => {
    if (!confirm('この時間帯料金を削除しますか？')) return

    try {
      const response = await fetch(
        `/api/admin/shops/${shopId}/prices/time/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '削除に失敗しました')
      }

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  const handleSaveNominationPrice = async () => {
    try {
      const price = parseInt(nominationPriceInput) || 0
      
      const response = await fetch(
        `/api/admin/shops/${shopId}/prices/nomination`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ price }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '保存に失敗しました')
      }

      setNominationPrice(price)
      router.refresh()
      alert('保存しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存に失敗しました')
    }
  }

  const handleSaveTaxRate = async () => {
    try {
      const response = await fetch(`/api/admin/shops/${shopId}/prices/tax`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: taxRate }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '保存に失敗しました')
      }

      router.refresh()
      alert('保存しました')
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存に失敗しました')
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Time Prices */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">時間帯別料金</h2>
              <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                追加
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      開始時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      終了時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      料金
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timePrices.map((price) => (
                    <tr key={price.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {price.start_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {price.end_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {price.price.toLocaleString()}円
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(price)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteTimePrice(price.id)}
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

        {/* Nomination Price */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">指名料</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={nominationPriceInput}
                onChange={(e) => setNominationPriceInput(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="0"
              />
              <span className="text-gray-700">円</span>
              <button
                onClick={handleSaveNominationPrice}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>

        {/* Tax Rate */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">サービスチャージ・税込み率</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="1"
              />
              <span className="text-gray-700">
                ({((taxRate || 0) * 100).toFixed(0)}%)
              </span>
              <button
                onClick={handleSaveTaxRate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                保存
              </button>
            </div>
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
              <form onSubmit={handleSubmitTimePrice}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingPrice ? '時間帯料金編集' : '時間帯料金追加'}
                  </h3>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="start_time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        開始時間 (HH:MM)
                      </label>
                      <input
                        type="text"
                        id="start_time"
                        required
                        pattern="\d{2}:\d{2}"
                        placeholder="20:00"
                        value={formData.start_time}
                        onChange={(e) =>
                          setFormData({ ...formData, start_time: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="end_time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        終了時間 (HH:MM)
                      </label>
                      <input
                        type="text"
                        id="end_time"
                        required
                        pattern="\d{2}:\d{2}"
                        placeholder="20:15"
                        value={formData.end_time}
                        onChange={(e) =>
                          setFormData({ ...formData, end_time: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        料金（円）
                      </label>
                      <input
                        type="number"
                        id="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
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
