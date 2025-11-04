import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase'
import { calculatePriceRange, formatPriceRange } from '@/lib/price-calculator'
import ReviewForm from '@/components/ReviewForm'
import CastDetailClient from '@/components/CastDetailClient'
import CastImage from '@/components/CastImage'

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

interface Review {
  id: string
  cute_score: number
  talk_score: number
  price_score: number
  comment: string | null
  created_at: string
}

const DEFAULT_IMAGE = '/default-cast.png'

async function getCast(castId: string): Promise<Cast | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('casts')
    .select(`
      *,
      shops (
        id,
        name,
        area_id
      )
    `)
    .eq('id', castId)
    .single()

  if (error) {
    console.error('Error fetching cast:', error)
    return null
  }

  return data
}

async function getCastWithPrice(cast: Cast) {
  const supabase = await createSupabaseServerClient()
  const shopId = cast.shops.id

  // Fetch time prices
  const { data: timePrices } = await supabase
    .from('shop_prices_time')
    .select('*')
    .eq('shop_id', shopId)

  // Fetch nomination price
  const { data: nominationPrice } = await supabase
    .from('shop_prices_nomination')
    .select('*')
    .eq('shop_id', shopId)
    .single()

  // Fetch tax rate
  const { data: tax } = await supabase
    .from('shop_tax')
    .select('*')
    .eq('shop_id', shopId)
    .single()

  const taxRate = (tax as { price: number } | null)?.price || 0.35

  // Calculate price range
  const priceRange = calculatePriceRange(
    (timePrices || []) as Array<{ start_time: string; end_time: string; price: number }>,
    nominationPrice ? { price: (nominationPrice as { price: number }).price } : null,
    taxRate
  )

  return {
    ...cast,
    priceRange: formatPriceRange(priceRange.min, priceRange.max),
  }
}

async function getReviews(castId: string): Promise<Review[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('cast_id', castId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data || []
}

async function getArea(areaId: string) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('areas')
    .select('*')
    .eq('id', areaId)
    .single()

  return data as { id: string; name: string; prefecture: string; city: string } | null
}

export default async function CastDetailPage({
  params,
}: {
  params: Promise<{ castId: string }>
}) {
  const { castId } = await params
  const cast = await getCast(castId)

  if (!cast) {
    return (
        <div className="min-h-screen bg-cabaret-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gold mb-4 leading-tight">
              キャストが見つかりません
            </h1>
            <Link href="/" className="text-gold hover:text-gold-bright active:scale-95 inline-block transition-all duration-ios text-base font-medium">
              ホームに戻る
            </Link>
          </div>
        </div>
    )
  }

  const castWithPrice = await getCastWithPrice(cast)
  const reviews = await getReviews(castId)
  const area = await getArea(cast.shops.area_id)

  // Calculate average scores
  const avgCuteScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.cute_score, 0) / reviews.length
      : 0
  const avgTalkScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.talk_score, 0) / reviews.length
      : 0
  const avgPriceScore =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.price_score, 0) / reviews.length
      : 0

  return (
    <main className="min-h-screen bg-cabaret-dark py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={area ? `/area/${area.id}` : '/'}
          className="text-gold hover:text-gold-bright active:scale-95 inline-flex items-center gap-2 mb-4 transition-all duration-ios text-base font-medium"
        >
          <span>←</span>
          <span>エリア一覧に戻る</span>
        </Link>

        <CastImage
          imageUrl={castWithPrice.image_url}
          alt={castWithPrice.name}
          name={castWithPrice.name}
          shopName={castWithPrice.shops.name}
          area={area}
          priceRange={castWithPrice.priceRange}
          instagramUrl={castWithPrice.instagram_url}
        />

        <CastDetailClient castId={castId} />

        <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gold mb-4 sm:mb-5 leading-tight">
            評価平均
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-base text-cabaret-text-light leading-relaxed">可愛さ・綺麗さ</span>
                <span className="text-lg sm:text-xl font-semibold text-gold">
                  {avgCuteScore.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base text-cabaret-text-light leading-relaxed">話しやすさ</span>
                <span className="text-lg sm:text-xl font-semibold text-gold">
                  {avgTalkScore.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base text-cabaret-text-light leading-relaxed">金額</span>
                <span className="text-lg sm:text-xl font-semibold text-gold">
                  {avgPriceScore.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          ) : (
            <p className="text-base text-cabaret-text-secondary leading-relaxed">まだ評価がありません</p>
          )}
        </div>

        <div className="mb-6 sm:mb-8">
          <ReviewForm castId={castId} />
        </div>

        <div className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gold mb-4 sm:mb-5 leading-tight">
            口コミ ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-base text-cabaret-text-secondary leading-relaxed">まだ口コミがありません</p>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gold/20 pb-4 sm:pb-5 last:border-b-0">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-cabaret-text-secondary">可愛さ・綺麗さ:</span>
                      <span className="font-semibold text-gold">{review.cute_score}/5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-cabaret-text-secondary">話しやすさ:</span>
                      <span className="font-semibold text-gold">{review.talk_score}/5</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-cabaret-text-secondary">金額:</span>
                      <span className="font-semibold text-gold">{review.price_score}/5</span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-base text-cabaret-text-light mb-2 sm:mb-3 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-cabaret-text-secondary">
                    {new Date(review.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
