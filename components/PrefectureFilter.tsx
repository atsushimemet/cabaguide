'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Area {
  id: string
  name: string
  prefecture: string
  city: string
}

interface PrefectureFilterProps {
  areas: Area[]
}

export default function PrefectureFilter({ areas }: PrefectureFilterProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('全て')

  // 都道府県の一意なリストを取得
  const prefectures = useMemo(() => {
    const uniquePrefectures = Array.from(
      new Set(areas.map((area) => area.prefecture))
    ).sort()
    return uniquePrefectures
  }, [areas])

  // 選択された都道府県でフィルタリングされたエリア
  const filteredAreas = useMemo(() => {
    if (selectedPrefecture === '全て') {
      return areas
    }
    return areas.filter((area) => area.prefecture === selectedPrefecture)
  }, [areas, selectedPrefecture])

  // フィルタリングされたエリアを都道府県・市区でグループ化
  const groupedAreas = useMemo(() => {
    const grouped = filteredAreas.reduce((acc, area) => {
      const key = `${area.prefecture}_${area.city}`
      if (!acc[key]) {
        acc[key] = {
          prefecture: area.prefecture,
          city: area.city,
          areas: [],
        }
      }
      acc[key].areas.push(area)
      return acc
    }, {} as Record<string, { prefecture: string; city: string; areas: Area[] }>)

    return Object.values(grouped)
  }, [filteredAreas])

  return (
    <>
      {/* 都道府県フィルター */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gold mb-4 leading-relaxed">
            都道府県で絞り込む
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedPrefecture('全て')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-ios-sm text-sm sm:text-base font-medium transition-all duration-ios active:scale-[0.98] ${
                selectedPrefecture === '全て'
                  ? 'bg-gradient-to-r from-gold to-gold-bright text-cabaret-dark shadow-gold-glow'
                  : 'bg-cabaret-dark-section text-cabaret-text-light border border-gold/40 hover:border-gold hover:bg-cabaret-dark-card'
              }`}
            >
              全て
            </button>
            {prefectures.map((prefecture) => (
              <button
                key={prefecture}
                onClick={() => setSelectedPrefecture(prefecture)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-ios-sm text-sm sm:text-base font-medium transition-all duration-ios active:scale-[0.98] ${
                  selectedPrefecture === prefecture
                    ? 'bg-gradient-to-r from-gold to-gold-bright text-cabaret-dark shadow-gold-glow'
                    : 'bg-cabaret-dark-section text-cabaret-text-light border border-gold/40 hover:border-gold hover:bg-cabaret-dark-card'
                }`}
              >
                {prefecture}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* エリア一覧 */}
      <div className="space-y-6 sm:space-y-8">
        {groupedAreas.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gold mb-5 leading-relaxed">
              {group.prefecture}・{group.city}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {group.areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/area/${area.id}`}
                  className="block p-4 sm:p-5 border border-gold/40 rounded-ios-sm bg-cabaret-dark-card hover:border-gold hover:bg-cabaret-dark-section hover:shadow-gold-glow active:scale-[0.98] transition-all duration-ios min-h-[60px] flex items-center"
                >
                  <h3 className="text-base sm:text-lg font-medium text-cabaret-text-light leading-relaxed">
                    {area.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {groupedAreas.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-base text-cabaret-text-secondary">
              {selectedPrefecture === '全て'
                ? 'エリアが登録されていません'
                : `${selectedPrefecture}に該当するエリアがありません`}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

