// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, shop_id, image_url, instagram_url } = body

    if (!name || !shop_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('casts')
      .update({
        name,
        shop_id,
        image_url: image_url || null,
        instagram_url: instagram_url || null,
      })
      .eq('id', id)
      .select(`
        *,
        shops (
          id,
          name,
          areas (
            id,
            name,
            prefecture,
            city
          )
        )
      `)
      .single()

    if (error) {
      console.error('Error updating cast:', error)
      return NextResponse.json(
        { error: 'Failed to update cast' },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabase
      .from('casts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting cast:', error)
      return NextResponse.json(
        { error: 'Failed to delete cast' },
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
