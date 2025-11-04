'use client'

import { useState, useEffect } from 'react'

interface CastDetailClientProps {
  castId: string
}

export default function CastDetailClient({ castId }: CastDetailClientProps) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    fetchLikes()
  }, [castId])

  const fetchLikes = async () => {
    try {
      const response = await fetch(`/api/likes?castId=${castId}`)
      if (response.ok) {
        const data = await response.json()
        setLikes(data.totalLikes)
        setHasLiked(data.hasLiked)
      }
    } catch (error) {
      console.error('Error fetching likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (hasLiked || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ castId }),
      })

      if (response.ok) {
        setHasLiked(true)
        setLikes((prev) => prev + 1)
      } else {
        const data = await response.json()
        alert(data.error || 'いいねに失敗しました')
      }
    } catch (error) {
      console.error('Error liking:', error)
      alert('いいねに失敗しました')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gold leading-tight">いいね</h2>
        <button
          onClick={handleLike}
          disabled={hasLiked || isLiking || isLoading}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-ios-sm transition-all duration-ios active:scale-95 ${
            hasLiked
              ? 'bg-cabaret-dark-section text-cabaret-text-secondary cursor-not-allowed border border-gold/20'
              : 'bg-gradient-to-r from-rose-gold to-cabaret-pink text-white hover:from-cabaret-pink hover:to-rose-gold border border-transparent'
          }`}
        >
          <span>{hasLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm sm:text-base font-medium">
            {isLoading ? '読み込み中...' : `${likes}いいね`}
          </span>
        </button>
      </div>
    </div>
  )
}
