// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shopId } = await params
    const body = await request.json()
    const { price } = body

    if (price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if nomination price exists
    const { data: existing } = await supabase
      .from('shop_prices_nomination')
      .select('*')
      .eq('shop_id', shopId)
      .single()

    let data
    let error

    if (existing) {
      // Update existing
      const result = await supabase
        .from('shop_prices_nomination')
        .update({ price })
        .eq('shop_id', shopId)
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Insert new
      const result = await supabase
        .from('shop_prices_nomination')
        .insert({
          shop_id: shopId,
          price,
        })
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Error upserting nomination price:', error)
      return NextResponse.json(
        { error: 'Failed to save nomination price' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
