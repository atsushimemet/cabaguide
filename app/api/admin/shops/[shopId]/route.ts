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
    const { name, area_id, address, phone, website } = body

    if (!name || !area_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('shops')
      .update({
        name,
        area_id,
        address: address || null,
        phone: phone || null,
        website: website || null,
      })
      .eq('id', shopId)
      .select(`
        *,
        areas (
          id,
          name,
          prefecture,
          city
        )
      `)
      .single()

    if (error) {
      console.error('Error updating shop:', error)
      return NextResponse.json(
        { error: 'Failed to update shop' },
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
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId)

    if (error) {
      console.error('Error deleting shop:', error)
      return NextResponse.json(
        { error: 'Failed to delete shop' },
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
