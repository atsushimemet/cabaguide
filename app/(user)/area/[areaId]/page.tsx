import { createSupabaseServerClient } from '@/lib/supabase'
import CastCard from '@/components/CastCard'
import { calculatePriceRange, formatPriceRange } from '@/lib/price-calculator'
import Link from 'next/link'

interface Cast {
  id: string
  name: string
  shop_id: string
  image_url: string | null
  instagram_url: string | null
  shops: {
    id: string
    name: string
    area_id: string
  }
}

interface Area {
  id: string
  name: string
  prefecture: string
  city: string
}

async function getArea(areaId: string): Promise<Area | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('id', areaId)
    .single()

  if (error) {
    console.error('Error fetching area:', error)
    return null
  }

  return data
}

async function getCasts(areaId: string) {
  const supabase = await createSupabaseServerClient()

  // Fetch casts with shop information
  const { data: casts, error } = await supabase
    .from('casts')
    .select(`
      *,
      shops!inner (
        id,
        name,
        area_id
      )
    `)
    .eq('shops.area_id', areaId)
    .limit(10)

  if (error) {
    console.error('Error fetching casts:', error)
    return []
  }

  // Fetch price information for each shop
  const castsWithPrices = await Promise.all(
    (casts || []).map(async (cast: Cast) => {
      const shopId = cast.shops.id

      // Fetch time prices
      const { data: timePrices, error: timePricesError } = await supabase
        .from('shop_prices_time')
        .select('start_time, end_time, price')
        .eq('shop_id', shopId)
        .order('start_time', { ascending: true })

      if (timePricesError) {
        console.error('Error fetching time prices for shop', shopId, ':', timePricesError)
      }

      // Log for debugging
      if (!timePrices || timePrices.length === 0) {
        console.warn('No time prices found for shop', shopId)
      } else {
        console.log('Found time prices for shop', shopId, ':', timePrices.length, 'entries')
      }

      // Fetch nomination price
      const { data: nominationPrice, error: nominationError } = await supabase
        .from('shop_prices_nomination')
        .select('*')
        .eq('shop_id', shopId)
        .single()

      if (nominationError && nominationError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is acceptable
        console.error('Error fetching nomination price:', nominationError)
      }

      // Fetch tax rate
      const { data: tax, error: taxError } = await supabase
        .from('shop_tax')
        .select('*')
        .eq('shop_id', shopId)
        .single()

      if (taxError && taxError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is acceptable
        console.error('Error fetching tax:', taxError)
      }

      const taxRate = (tax as { price: number } | null)?.price || 0.35

      // Calculate price range
      const priceRange = calculatePriceRange(
        (timePrices || []) as Array<{ start_time: string; end_time: string; price: number }>,
        nominationPrice ? { price: (nominationPrice as { price: number }).price } : null,
        taxRate
      )

      return {
        ...cast,
        shop: cast.shops,
        priceRange: formatPriceRange(priceRange.min, priceRange.max),
        priceDetails: {
          timePrices: (timePrices || []) as Array<{ start_time: string; end_time: string; price: number }>,
          nominationPrice: nominationPrice ? (nominationPrice as { price: number }).price : null,
          taxRate: taxRate,
          calculatedRange: priceRange,
        },
      }
    })
  )

  return castsWithPrices
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ areaId: string }>
}) {
  const { areaId } = await params
  const area = await getArea(areaId)
  const casts = await getCasts(areaId)

  if (!area) {
    return (
      <div className="min-h-screen bg-cabaret-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold mb-4 leading-tight">
            エリアが見つかりません
          </h1>
          <Link href="/" className="text-gold hover:text-gold-bright active:scale-95 inline-block transition-all duration-ios text-base font-medium">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-cabaret-dark py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-gold hover:text-gold-bright active:scale-95 inline-flex items-center gap-2 mb-4 transition-all duration-ios text-base font-medium"
          >
            <span>←</span>
            <span>エリア一覧に戻る</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gold leading-tight">
            {area.prefecture}・{area.city}・{area.name}
          </h1>
        </div>

        {casts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-base text-cabaret-text-secondary">このエリアにはキャストが登録されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {casts.map((cast) => (
              <CastCard
                key={cast.id}
                id={cast.id}
                name={cast.name}
                shopName={cast.shop.name}
                imageUrl={cast.image_url}
                instagramUrl={cast.instagram_url}
                priceRange={cast.priceRange}
                priceDetails={cast.priceDetails}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
