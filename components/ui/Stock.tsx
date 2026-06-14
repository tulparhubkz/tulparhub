import { stockStatus, totalStock } from '@/lib/utils'

interface StockProps {
  stock: Record<string, number>
}

export function Stock({ stock }: StockProps) {
  const status = stockStatus(stock)
  const total = totalStock(stock)
  return (
    <div className={`stock stock-${status}`}>
      <span className="stock-dot" />
      <span className="stock-text">
        {status === 'ok' && 'В наличии на складах'}
        {status === 'low' && `Осталось ${total} шт`}
        {status === 'no' && 'Под заказ · 3–5 дней'}
      </span>
    </div>
  )
}
