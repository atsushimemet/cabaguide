// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { calculatePriceRange, formatPriceRange } from '@/lib/price-calculator'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const areaId = searchParams.get('areaId')

    if (!areaId) {
      return NextResponse.json({ error: 'areaId is required' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Fetch casts with shop information
    const { data: casts, error: castsError } = await supabase
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

    if (castsError) {
      console.error('Error fetching casts:', castsError)
      return NextResponse.json({ error: 'Failed to fetch casts' }, { status: 500 })
    }

    // Fetch price information for each shop
    const castsWithPrices = await Promise.all(
      (casts || []).map(async (cast: any) => {
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

        const taxRate = tax?.price || 0.35

        // Calculate price range
        const priceRange = calculatePriceRange(
          timePrices || [],
          nominationPrice ? { price: nominationPrice.price } : null,
          taxRate
        )

        return {
          ...cast,
          shop: cast.shops,
          priceRange: formatPriceRange(priceRange.min, priceRange.max),
        }
      })
    )

    return NextResponse.json(castsWithPrices)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
