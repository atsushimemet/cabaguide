'use client'

import { useState, FormEvent } from 'react'
import StarRating from './StarRating'

interface ReviewFormProps {
  castId: string
  onSuccess?: () => void
}

export default function ReviewForm({ castId, onSuccess }: ReviewFormProps) {
  const [cuteScore, setCuteScore] = useState(0)
  const [talkScore, setTalkScore] = useState(0)
  const [priceScore, setPriceScore] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (cuteScore === 0 || talkScore === 0 || priceScore === 0) {
      setError('すべての項目で星評価を選択してください')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          castId,
          cuteScore,
          talkScore,
          priceScore,
          comment: comment || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '口コミの投稿に失敗しました')
      }

      setSuccess(true)
      setCuteScore(0)
      setTalkScore(0)
      setPriceScore(0)
      setComment('')

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
          setSuccess(false)
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '口コミの投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-ios-sm p-4 sm:p-5">
        <p className="text-green-800 text-base leading-relaxed">口コミを投稿しました！</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-gold mb-4 sm:mb-5 leading-tight">
        口コミを投稿
      </h3>

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 rounded-ios-sm p-4 sm:p-5 mb-4 sm:mb-5">
          <p className="text-red-200 text-base leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-4 sm:space-y-5 mb-4 sm:mb-5">
        <StarRating
          value={cuteScore}
          onChange={setCuteScore}
          label="可愛さ・綺麗さ"
        />
        <StarRating
          value={talkScore}
          onChange={setTalkScore}
          label="話しやすさ"
        />
        <StarRating
          value={priceScore}
          onChange={setPriceScore}
          label="金額"
        />
      </div>

      <div className="mb-5 sm:mb-6">
        <label
          htmlFor="comment"
          className="block text-sm sm:text-base font-medium text-cabaret-text-light mb-2.5 leading-relaxed"
        >
          コメント（任意）
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gold/40 rounded-ios-sm shadow-sm bg-cabaret-dark-section text-cabaret-text-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold placeholder:text-cabaret-text-secondary text-base leading-relaxed transition-all duration-ios"
          placeholder="コメントを入力してください"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-gold to-gold-bright text-cabaret-dark py-3 px-5 rounded-ios-sm hover:from-gold-bright hover:to-gold active:scale-[0.98] disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-ios text-base font-semibold"
      >
        {isSubmitting ? '投稿中...' : '口コミを投稿'}
      </button>
    </form>
  )
}
