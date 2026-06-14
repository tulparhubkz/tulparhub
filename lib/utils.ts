export const fmtKZT = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₸'

export const fmtVAT = (n: number, vat: number) =>
  Math.round(n / (1 + vat / 100))

export const totalStock = (stock: Record<string, number>) =>
  Object.values(stock).reduce((a, b) => a + b, 0)

export const stockStatus = (stock: Record<string, number>): 'ok' | 'low' | 'no' => {
  const total = totalStock(stock)
  if (total > 20) return 'ok'
  if (total > 0) return 'low'
  return 'no'
}
