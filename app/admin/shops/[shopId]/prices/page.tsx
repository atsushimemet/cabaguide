import { createSupabaseServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import PriceManagementClient from '@/components/admin/PriceManagementClient'
import Link from 'next/link'

async function getShop(shopId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single()

  if (error) {
    console.error('Error fetching shop:', error)
    return null
  }

  return data as { id: string; name: string; area_id: string; address: string | null; phone: string | null; website: string | null; created_at: string; updated_at: string } | null
}

async function getPrices(shopId: string) {
  const supabase = await createSupabaseServerClient()

  const [timePrices, nominationPrice, tax] = await Promise.all([
    supabase
      .from('shop_prices_time')
      .select('*')
      .eq('shop_id', shopId)
      .order('start_time', { ascending: true }),
    supabase
      .from('shop_prices_nomination')
      .select('*')
      .eq('shop_id', shopId)
      .single(),
    supabase
      .from('shop_tax')
      .select('*')
      .eq('shop_id', shopId)
      .single(),
  ])

  return {
    timePrices: timePrices.data || [],
    nominationPrice: nominationPrice.data || null,
    tax: tax.data || null,
  }
}

export default async function ShopPricesPage({
  params,
}: {
  params: Promise<{ shopId: string }>
}) {
  const { shopId } = await params
  const shop = await getShop(shopId)
  const prices = await getPrices(shopId)

  if (!shop) {
    redirect('/admin/shops')
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/shops"
          className="text-blue-600 hover:text-blue-800"
        >
          ← 店舗一覧に戻る
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {shop.name} - 料金設定
        </h1>
      </div>
      <PriceManagementClient shopId={shopId} initialPrices={prices} />
    </div>
  )
}
