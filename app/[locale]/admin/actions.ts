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
import { updateLeadStatus, type LeadStatus } from '@/lib/services/leads'

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

export async function setLeadStatus(id: string, status: LeadStatus) {
  if (!(await getAdmin())) return { ok: false, message: 'Доступ запрещён' }
  try {
    await updateLeadStatus(id, status)
    revalidatePath('/admin/leads')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setLeadStatus error:', err)
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
    await updateOrderPayment(id, paymentStatus)
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    console.error('[admin] setPaymentStatus error:', err)
    return { ok: false, message: 'Не удалось обновить оплату' }
  }
}
