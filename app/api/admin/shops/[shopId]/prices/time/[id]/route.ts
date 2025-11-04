import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string; id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shopId, id } = await params
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
      .update({
        start_time,
        end_time,
        price,
      })
      .eq('id', id)
      .eq('shop_id', shopId)
      .select()
      .single()

    if (error) {
      console.error('Error updating time price:', error)
      return NextResponse.json(
        { error: 'Failed to update time price' },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string; id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shopId, id } = await params
    const { error } = await supabase
      .from('shop_prices_time')
      .delete()
      .eq('id', id)
      .eq('shop_id', shopId)

    if (error) {
      console.error('Error deleting time price:', error)
      return NextResponse.json(
        { error: 'Failed to delete time price' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
