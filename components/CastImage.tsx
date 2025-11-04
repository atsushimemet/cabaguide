'use client'

import Image from 'next/image'
import { useState } from 'react'

interface CastImageProps {
  imageUrl: string | null
  alt: string
  name: string
  shopName: string
  area?: {
    prefecture: string
    city: string
    name: string
  } | null
  priceRange: string
  instagramUrl: string | null
}

const DEFAULT_IMAGE = '/default-cast.png'

export default function CastImage({
  imageUrl,
  alt,
  name,
  shopName,
  area,
  priceRange,
  instagramUrl,
}: CastImageProps) {
  // If imageUrl is null or empty, use default image
  const initialImage = imageUrl && imageUrl.trim() !== '' ? imageUrl : DEFAULT_IMAGE
  const [imgSrc, setImgSrc] = useState(initialImage)
  const [hasError, setHasError] = useState(false)

  const handleImageError = () => {
    // Only set default image if not already using it
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE)
      setHasError(false)
    } else {
      // If default image also fails, show placeholder
      setHasError(true)
    }
  }

  return (
    <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 overflow-hidden mb-6 sm:mb-8">
      <div className="md:flex">
        <div className="relative w-full md:w-1/2 h-64 md:h-96 bg-gray-200 rounded-t-ios md:rounded-l-ios md:rounded-tr-none overflow-hidden">
          {hasError ? (
            // Fallback placeholder if image fails to load
            <div className="w-full h-full flex items-center justify-center bg-cabaret-dark-section">
              <div className="text-center">
                <svg
                  className="w-24 h-24 mx-auto text-cabaret-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="text-sm text-cabaret-text-secondary mt-2">画像なし</p>
              </div>
            </div>
          ) : (
            <Image
              src={imgSrc}
              alt={alt}
              fill
              className="object-cover"
              onError={handleImageError}
              unoptimized={imgSrc === DEFAULT_IMAGE}
            />
          )}
        </div>
        <div className="p-5 sm:p-6 md:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold mb-2.5 leading-tight">
            {name}
          </h1>
          <p className="text-base sm:text-lg text-cabaret-text-secondary mb-4 leading-relaxed">
            {shopName}
          </p>
          {area && (
            <p className="text-sm text-cabaret-text-secondary mb-4 leading-relaxed">
              {area.prefecture}・{area.city}・{area.name}
            </p>
          )}
          <p className="text-base sm:text-lg font-semibold text-gold mb-4 leading-relaxed">
            料金目安: {priceRange}
          </p>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-gold hover:text-cabaret-pink active:scale-95 transition-all duration-ios inline-block"
            >
              Instagram →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
