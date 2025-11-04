export interface ShopPriceTime {
  start_time: string
  end_time: string
  price: number
}

export interface ShopPriceNomination {
  price: number
}

export interface ShopTax {
  tax_category: string
  price: number // Tax rate as decimal (e.g., 0.35 for 35%)
}

/**
 * 時間帯別料金から1時間あたりの最安値・最大値を算出
 * サービスチャージ・税込みを加算した料金目安を計算
 * 
 * 注意: 時間帯別料金は、その時間帯に入店した場合の1時間のセット料金を指すため、
 * 時間で割る必要はなく、料金をそのまま使用する
 */
export function calculatePriceRange(
  timePrices: ShopPriceTime[],
  nominationPrice: ShopPriceNomination | null,
  taxRate: number = 0.35 // Default to 35% if not provided
): { min: number; max: number } {
  if (timePrices.length === 0) {
    return { min: 0, max: 0 }
  }

  let minHourlyPrice = Infinity
  let maxHourlyPrice = -Infinity

  for (const timePrice of timePrices) {
    // 時間帯別料金は既に1時間あたりの料金なので、そのまま使用
    const hourlyPrice = timePrice.price
    minHourlyPrice = Math.min(minHourlyPrice, hourlyPrice)
    maxHourlyPrice = Math.max(maxHourlyPrice, hourlyPrice)
  }

  // 指名料を加算（1時間あたり）
  if (nominationPrice) {
    minHourlyPrice += nominationPrice.price
    maxHourlyPrice += nominationPrice.price
  }

  // サービスチャージ・税込みを加算（35%）
  const minWithTax = Math.round(minHourlyPrice * (1 + taxRate))
  const maxWithTax = Math.round(maxHourlyPrice * (1 + taxRate))

  return {
    min: minWithTax,
    max: maxWithTax,
  }
}

/**
 * 時間文字列（HH:MM形式）を分に変換
 */
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * 開始時間から終了時間までの時間（時間単位）を計算
 * 24時を跨ぐ場合も考慮
 */
function calculateDuration(startTime: number, endTime: number): number {
  if (endTime < startTime) {
    // 24時を跨ぐ場合（例: 21:00 ～ 1:00）
    return (24 * 60 - startTime + endTime) / 60
  }
  return (endTime - startTime) / 60
}

/**
 * 料金範囲を表示用の文字列にフォーマット
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === 0 && max === 0) {
    return '料金未設定'
  }
  if (min === max) {
    return `${min.toLocaleString()}円`
  }
  return `${min.toLocaleString()}円 ～ ${max.toLocaleString()}円`
}

/**
 * 時間文字列（HH:MM形式）を分に変換（外部から使用可能）
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

/**
 * 開始時間から終了時間までの時間（時間単位）を計算（外部から使用可能）
 * 24時を跨ぐ場合も考慮
 */
export function calculateDurationInHours(
  startTime: string,
  endTime: string
): number {
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)

  if (endMinutes < startMinutes) {
    // 24時を跨ぐ場合（例: 21:00 ～ 1:00）
    return (24 * 60 - startMinutes + endMinutes) / 60
  }
  return (endMinutes - startMinutes) / 60
}
