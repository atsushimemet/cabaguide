import { Suspense } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase'
import Footer from '@/components/Footer'
import PrefectureFilter from '@/components/PrefectureFilter'
import AuthErrorHandler from '@/components/AuthErrorHandler'

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

  return (
    <>
      <Suspense fallback={null}>
        <AuthErrorHandler />
      </Suspense>
      <main className="min-h-screen bg-cabaret-dark py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gold mb-3 leading-tight">
              キャバクラキャスト検索
            </h1>
            <p className="text-base text-cabaret-text-secondary">エリアを選択してください</p>
          </div>

          <PrefectureFilter areas={areas} />
        </div>
      </main>
      <Footer />
    </>
  )
}
