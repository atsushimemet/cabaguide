'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  label: string
  disabled?: boolean
}

export default function StarRating({
  value,
  onChange,
  label,
  disabled = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="mb-4">
      <label className="block text-sm sm:text-base font-medium text-cabaret-text-light mb-2 leading-relaxed">
        {label}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => !disabled && setHoverValue(0)}
            disabled={disabled}
            className={`text-2xl transition-all duration-ios active:scale-95 ${
              disabled ? 'cursor-default' : 'cursor-pointer'
            } ${
              star <= (hoverValue || value)
                ? 'text-gold'
                : 'text-cabaret-text-secondary'
            }`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm sm:text-base text-gold">
          {value > 0 ? `${value} / 5` : ''}
        </span>
      </div>
    </div>
  )
}
