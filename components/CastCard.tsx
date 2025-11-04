'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface TimePrice {
  start_time: string
  end_time: string
  price: number
}

interface PriceDetails {
  timePrices: TimePrice[]
  nominationPrice: number | null
  taxRate: number
  calculatedRange: {
    min: number
    max: number
  }
}

interface CastCardProps {
  id: string
  name: string
  shopName: string
  imageUrl: string | null
  instagramUrl: string | null
  priceRange: string
  priceDetails?: PriceDetails
}

const DEFAULT_IMAGE = '/default-cast.png'

export default function CastCard({
  id,
  name,
  shopName,
  imageUrl,
  instagramUrl,
  priceRange,
  priceDetails,
}: CastCardProps) {
  // If imageUrl is null or empty, use default image
  const initialImage = imageUrl && imageUrl.trim() !== '' ? imageUrl : DEFAULT_IMAGE
  const [imgSrc, setImgSrc] = useState(initialImage)
  const [hasError, setHasError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

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
    <>
      <Link href={`/cast/${id}`}>
        <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 overflow-hidden hover:shadow-gold-glow-lg hover:border-gold active:scale-[0.98] transition-all duration-ios">
          <div className="relative w-full h-64 bg-gray-200 rounded-t-ios overflow-hidden">
            {hasError ? (
              // Fallback placeholder if image fails to load
              <div className="w-full h-full flex items-center justify-center bg-cabaret-dark-section">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-cabaret-text-secondary"
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
                  <p className="text-xs text-cabaret-text-secondary mt-2">画像なし</p>
                </div>
              </div>
            ) : (
              <Image
                src={imgSrc}
                alt={name}
                fill
                className="object-cover"
                onError={handleImageError}
                unoptimized={imgSrc === DEFAULT_IMAGE}
              />
            )}
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold text-cabaret-text-light mb-1.5 leading-relaxed">
              {name}
            </h3>
            <p className="text-sm text-cabaret-text-secondary mb-3 leading-relaxed">{shopName}</p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-sm font-medium text-gold">
                料金目安: {priceRange}
              </p>
              {priceDetails && (
                <button
                  onClick={handleInfoClick}
                  className="text-cabaret-text-secondary hover:text-gold active:scale-95 transition-all duration-ios text-xs"
                  title="料金算出ロジックを表示"
                >
                  ℹ️
                </button>
              )}
            </div>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-rose-gold hover:text-cabaret-pink active:scale-95 transition-all duration-ios inline-block"
              >
                Instagram →
              </a>
            )}
          </div>
        </div>
      </Link>

      {isModalOpen && priceDetails && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-ios"
              onClick={handleCloseModal}
            ></div>
            <div
              className="inline-block align-bottom bg-cabaret-dark-card rounded-ios text-left overflow-hidden shadow-gold-glow-lg border border-gold/40 transform transition-all duration-ios sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-cabaret-dark-card px-5 pt-6 pb-5 sm:p-6 sm:pb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gold leading-tight">
                    料金算出ロジック
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-cabaret-text-secondary hover:text-gold active:scale-95 transition-all duration-ios text-xl leading-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gold mb-3 leading-relaxed">
                      時間帯別料金（1時間あたり）
                    </h4>
                    {priceDetails.timePrices.length > 0 ? (
                      <div className="space-y-2.5">
                        {priceDetails.timePrices.map((tp, index) => {
                          return (
                            <div
                              key={index}
                              className="text-sm sm:text-base text-cabaret-text-light bg-cabaret-dark-section border border-gold/20 p-3 sm:p-4 rounded-ios-sm leading-relaxed"
                            >
                              <div>
                                {tp.start_time} ～ {tp.end_time} :{' '}
                                {tp.price.toLocaleString()}円（1時間あたり）
                              </div>
                            </div>
                          )
                        })}
                        <div className="text-sm sm:text-base font-semibold text-gold mt-3 leading-relaxed">
                          最安値: {Math.min(
                            ...priceDetails.timePrices.map((tp) => tp.price)
                          ).toLocaleString()}
                          円 / 最大値:{' '}
                          {Math.max(
                            ...priceDetails.timePrices.map((tp) => tp.price)
                          ).toLocaleString()}
                          円
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-cabaret-text-secondary leading-relaxed">時間帯別料金が設定されていません</p>
                    )}
                  </div>

                  {priceDetails.nominationPrice !== null && (
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gold mb-3 leading-relaxed">
                        指名料
                      </h4>
                      <p className="text-sm sm:text-base text-cabaret-text-light leading-relaxed">
                        {priceDetails.nominationPrice.toLocaleString()}円（1時間あたり）
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gold mb-3 leading-relaxed">
                      サービスチャージ・税込み率
                    </h4>
                    <p className="text-sm sm:text-base text-cabaret-text-light leading-relaxed">
                      {((priceDetails.taxRate || 0) * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div className="border-t border-gold/30 pt-5">
                    <h4 className="text-sm sm:text-base font-semibold text-gold mb-3 leading-relaxed">
                      算出結果
                    </h4>
                    <div className="text-sm sm:text-base text-cabaret-text-light space-y-2.5 leading-relaxed">
                      <div>
                        <span className="font-medium">1時間あたり最安値:</span>{' '}
                        {Math.min(
                          ...priceDetails.timePrices.map((tp) => tp.price)
                        ).toLocaleString()}
                        円
                        {priceDetails.nominationPrice && (
                          <>
                            {' '}
                            + 指名料{' '}
                            {priceDetails.nominationPrice.toLocaleString()}円 ={' '}
                            {(
                              Math.min(
                                ...priceDetails.timePrices.map((tp) => tp.price)
                              ) + priceDetails.nominationPrice
                            ).toLocaleString()}
                            円
                          </>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">1時間あたり最大値:</span>{' '}
                        {Math.max(
                          ...priceDetails.timePrices.map((tp) => tp.price)
                        ).toLocaleString()}
                        円
                        {priceDetails.nominationPrice && (
                          <>
                            {' '}
                            + 指名料{' '}
                            {priceDetails.nominationPrice.toLocaleString()}円 ={' '}
                            {(
                              Math.max(
                                ...priceDetails.timePrices.map((tp) => tp.price)
                              ) + priceDetails.nominationPrice
                            ).toLocaleString()}
                            円
                          </>
                        )}
                      </div>
                      <div className="border-t border-gold/30 pt-3 mt-3">
                        <div className="font-semibold text-gold mb-1.5 leading-relaxed">
                          サービスチャージ・税込み適用後:
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-gold leading-tight">
                          {priceDetails.calculatedRange.min.toLocaleString()}円 ～{' '}
                          {priceDetails.calculatedRange.max.toLocaleString()}円
                        </div>
                        <div className="text-xs sm:text-sm text-cabaret-text-secondary mt-1.5 leading-relaxed">
                          （1時間あたり料金 × {((priceDetails.taxRate || 0) * 100).toFixed(0)}%）
                        </div>
                        <div className="text-xs sm:text-sm text-cabaret-text-secondary mt-3 leading-relaxed">
                          ※本料金はメイン席による1時間あたりの料金目安です。
                        </div>
                        <div className="mt-4 pt-3 border-t border-gold/20">
                          <div className="text-xs sm:text-sm font-semibold text-gold mb-2 leading-relaxed">
                            【席種について】
                          </div>
                          <div className="space-y-1.5 text-xs sm:text-sm text-cabaret-text-secondary leading-relaxed">
                            <div>・メイン：通常の座席（メイン席）での料金。一般的なテーブル席での料金を指します。</div>
                            <div>・VP：VIP席やパーティ席での料金。店舗により異なる場合があります。</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-cabaret-dark-section px-5 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-ios border-t border-gold/30">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full inline-flex justify-center rounded-ios-sm border border-transparent shadow-sm px-5 py-3 bg-gradient-to-r from-gold to-gold-bright text-base font-medium text-cabaret-dark hover:from-gold-bright hover:to-gold active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-ios sm:ml-3 sm:w-auto sm:text-sm font-semibold"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
