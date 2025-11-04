import { createSupabaseServerClient } from '@/lib/supabase'
import ShopListClient from '@/components/admin/ShopListClient'

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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shops:', error)
    return []
  }

  return data || []
}

async function getAreas() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('prefecture', { ascending: true })
    .order('city', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching areas:', error)
    return []
  }

  return data || []
}

export default async function AdminShopsPage() {
  const shops = await getShops()
  const areas = await getAreas()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">店舗管理</h1>
      </div>
      <ShopListClient initialShops={shops} areas={areas} />
    </div>
  )
}
