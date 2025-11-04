import { createSupabaseServerClient } from '@/lib/supabase'
import AreaListClient from '@/components/admin/AreaListClient'

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

export default async function AdminAreasPage() {
  const areas = await getAreas()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">エリア管理</h1>
      </div>
      <AreaListClient initialAreas={areas} />
    </div>
  )
}
