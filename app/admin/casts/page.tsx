import { createSupabaseServerClient } from '@/lib/supabase'
import CastListClient from '@/components/admin/CastListClient'

async function getCasts() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('casts')
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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching casts:', error)
    return []
  }

  return data || []
}

async function getShops() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('shops')
    .select(`
      *,
      areas (
        id,
        name,
        prefecture,
        city
      )
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching shops:', error)
    return []
  }

  return data || []
}

export default async function AdminCastsPage() {
  const casts = await getCasts()
  const shops = await getShops()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">キャスト管理</h1>
      </div>
      <CastListClient initialCasts={casts} shops={shops} />
    </div>
  )
}
