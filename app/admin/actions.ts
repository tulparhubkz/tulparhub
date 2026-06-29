'use server'

import { revalidatePath } from 'next/cache'
import { getAdmin } from '@/lib/admin'
import {
  updateOrderStatus,
  updateOrderPayment,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/services/orders'

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!(await getAdmin())) return { ok: false, message: 'Доступ запрещён' }
  try {
    await updateOrderStatus(id, status)
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setOrderStatus error:', err)
    return { ok: false, message: 'Не удалось обновить статус' }
  }
}

export async function setPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  if (!(await getAdmin())) return { ok: false, message: 'Доступ запрещён' }
  try {
    await updateOrderPayment(id, paymentStatus)
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setPaymentStatus error:', err)
    return { ok: false, message: 'Не удалось обновить оплату' }
  }
}
