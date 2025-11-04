// @ts-nocheck
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .order('prefecture', { ascending: true })
      .order('city', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching areas:', error)
      return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
