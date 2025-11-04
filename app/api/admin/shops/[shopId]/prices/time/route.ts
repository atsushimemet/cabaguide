// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(
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
    const { start_time, end_time, price } = body

    if (!start_time || !end_time || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('shop_prices_time')
      .insert({
        shop_id: shopId,
        start_time,
        end_time,
        price,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating time price:', error)
      return NextResponse.json(
        { error: 'Failed to create time price' },
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
