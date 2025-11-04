import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase'
import Footer from '@/components/Footer'

interface Area {
  id: string
  name: string
  prefecture: string
  city: string
}

async function getAreas(): Promise<Area[]> {
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

export default async function Home() {
  const areas = await getAreas()

  // Group areas by prefecture and city
  const groupedAreas = areas.reduce((acc, area) => {
    const key = `${area.prefecture}_${area.city}`
    if (!acc[key]) {
      acc[key] = {
        prefecture: area.prefecture,
        city: area.city,
        areas: [],
      }
    }
    acc[key].areas.push(area)
    return acc
  }, {} as Record<string, { prefecture: string; city: string; areas: Area[] }>)

  const groupedAreasArray = Object.values(groupedAreas)

  return (
    <>
      <main className="min-h-screen bg-cabaret-dark py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-3 leading-tight">
              キャバクラキャスト検索
            </h1>
            <p className="text-base text-cabaret-text-secondary">エリアを選択してください</p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {groupedAreasArray.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-cabaret-dark-card rounded-ios shadow-gold-glow border border-gold/30 p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gold mb-5 leading-relaxed">
                  {group.prefecture}・{group.city}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {group.areas.map((area) => (
                    <Link
                      key={area.id}
                      href={`/area/${area.id}`}
                      className="block p-4 sm:p-5 border border-gold/40 rounded-ios-sm bg-cabaret-dark-card hover:border-gold hover:bg-cabaret-dark-section hover:shadow-gold-glow active:scale-[0.98] transition-all duration-ios min-h-[60px] flex items-center"
                    >
                      <h3 className="text-base sm:text-lg font-medium text-cabaret-text-light leading-relaxed">
                        {area.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {groupedAreasArray.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <p className="text-base text-cabaret-text-secondary">エリアが登録されていません</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
