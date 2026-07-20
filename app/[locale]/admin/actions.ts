'use server'

import { revalidatePath } from 'next/cache'
import { getAdmin } from '@/lib/admin'
import {
  updateOrderStatus,
  updateOrderPayment,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/services/orders'
import { updateUserRole, type UserRole } from '@/lib/services/users'
import { sendOrderStatusEmail } from '@/lib/order-email'

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (!(await getAdmin())) return { ok: false, message: 'Доступ запрещён' }
  try {
    const target = await updateOrderStatus(id, status)
    // Fire-and-forget customer email (temporary stand-in for SMS notifications).
    // A mail outage must never fail the status update the admin just made.
    if (target?.customerEmail) {
      void sendOrderStatusEmail({
        to: target.customerEmail,
        locale: 'ru', // orders carry no stored locale yet — default to RU
        invoiceNumber: target.invoiceNumber,
        status,
        kind: 'order',
      })
    }
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setOrderStatus error:', err)
    return { ok: false, message: 'Не удалось обновить статус' }
  }
}

export async function setUserRole(id: string, role: UserRole) {
  const admin = await getAdmin()
  if (!admin) return { ok: false, message: 'Доступ запрещён' }
  // Locking yourself out of /admin takes another admin (or the DB) — by design.
  if (admin.id === id) return { ok: false, message: 'Свою роль менять нельзя — попросите другого админа' }
  try {
    await updateUserRole(id, role)
    revalidatePath('/admin/users')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setUserRole error:', err)
    return { ok: false, message: 'Не удалось обновить роль' }
  }
}

export async function setPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  if (!(await getAdmin())) return { ok: false, message: 'Доступ запрещён' }
  try {
    const target = await updateOrderPayment(id, paymentStatus)
    if (target?.customerEmail) {
      void sendOrderStatusEmail({
        to: target.customerEmail,
        locale: 'ru',
        invoiceNumber: target.invoiceNumber,
        status: paymentStatus,
        kind: 'payment',
      })
    }
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setPaymentStatus error:', err)
    return { ok: false, message: 'Не удалось обновить оплату' }
  }
}
