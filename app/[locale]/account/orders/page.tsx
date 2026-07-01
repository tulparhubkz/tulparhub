import { auth } from '@/lib/auth'
import { listUserOrders, type OrderListItem } from '@/lib/services/orders'
import { MyOrders } from './MyOrders'

export const dynamic = 'force-dynamic'

export default async function MyOrdersPage() {
  let userId: string | null = null
  try {
    const session = await auth()
    userId = session?.user?.id ?? null
  } catch {
    /* auth not configured — treated as signed out */
  }

  let orders: OrderListItem[] = []
  if (userId) orders = await listUserOrders(userId)

  return <MyOrders signedIn={!!userId} orders={orders} />
}
