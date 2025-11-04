import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { castId } = body

    if (!castId) {
      return NextResponse.json(
        { error: 'castId is required' },
        { status: 400 }
      )
    }

    // Get IP address from request
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    const supabase = await createSupabaseServerClient()

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('cast_id', castId)
      .eq('ip_address', ipAddress)
      .single()

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('likes')
      .insert({
        cast_id: castId,
        ip_address: ipAddress,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating like:', error)
      return NextResponse.json(
        { error: 'Failed to create like' },
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const castId = searchParams.get('castId')

    if (!castId) {
      return NextResponse.json(
        { error: 'castId is required' },
        { status: 400 }
      )
    }

    // Get IP address from request
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown'

    const supabase = await createSupabaseServerClient()

    // Get total likes count
    const { count: totalLikes } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('cast_id', castId)

    // Check if current IP has liked
    const { data: userLike } = await supabase
      .from('likes')
      .select('*')
      .eq('cast_id', castId)
      .eq('ip_address', ipAddress)
      .single()

    return NextResponse.json({
      totalLikes: totalLikes || 0,
      hasLiked: !!userLike,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
