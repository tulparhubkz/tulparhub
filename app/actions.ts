'use server'

import { createLead } from '@/lib/services/leads'
import { createOrder, trackOrderByInvoice, attachOrderToUser, attachOrdersByEmail, type TrackedOrder } from '@/lib/services/orders'
import { backfillProfileFromOrder } from '@/lib/services/users'
import {
  listVehicles,
  importVehicles,
  addVehicle as addVehicleSvc,
  updateVehicle as updateVehicleSvc,
  removeVehicle as removeVehicleSvc,
  MAX_VEHICLES,
  type GarageVehicleDTO,
  type GarageVehicleInput,
} from '@/lib/services/garage'
import { notifyOps, formatOrderMessage, formatLeadMessage } from '@/lib/notify'
import { isValidPhone, isValidEmail } from '@/lib/validation'
import { rateLimit, clientIpFrom } from '@/lib/rateLimit'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import type { TranslationKey } from '@/lib/i18n/dictionaries'

// Results carry a translation key (+ ICU params), not prose — the UI runs in
// three locales and renders them via t(message, params). See issue #69.
export interface ActionResult {
  ok: boolean
  message: TranslationKey
  params?: Record<string, string>
  invoiceNumber?: string
  total?: number
  orderId?: string
}

export interface OrderPayload {
  kind: 'order' | 'callback' | 'booking' | 'quote'
  /** Buyer asked for B2B pricing (ЮЛ toggle). Only honored for b2b/admin sessions. */
  b2b?: boolean
  name: string
  phone: string
  email?: string
  city?: string
  comment?: string
  company?: string
  bin?: string
  payment?: string
  delivery?: string
  items?: Array<{ id: string; oem: string; name: string; qty: number; price: number }>
  unit_id?: string
  date_from?: string
  date_to?: string
  address?: string
}

export async function submitOrder(payload: OrderPayload): Promise<ActionResult> {
  // Per-IP throttle: spam must not reach the DB or the ops Telegram chat (#68).
  if (!rateLimit(`submit:${clientIpFrom(headers())}`, { limit: 5, windowMs: 60_000 })) {
    return { ok: false, message: 'act.rateLimited' }
  }
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, message: 'act.fillNamePhone' }
  }
  if (!isValidPhone(payload.phone)) {
    return { ok: false, message: 'act.badPhone' }
  }
  if (payload.email?.trim() && !isValidEmail(payload.email)) {
    return { ok: false, message: 'act.badEmail' }
  }

  // Real orders are persisted to orders/order_items; failures are surfaced so a
  // customer never sees "accepted" for an order that wasn't saved.
  if (payload.kind === 'order') {
    if (!payload.items?.length) {
      return { ok: false, message: 'act.emptyCart' }
    }
    // Attach the signed-in user if there is a session (guest checkout otherwise).
    let userId: string | null = null
    let sessionEmail: string | null = null
    let sessionRole: string | null = null
    try {
      const session = await auth()
      userId = session?.user?.id ?? null
      sessionEmail = session?.user?.email ?? null
      sessionRole = (session?.user as { role?: string } | undefined)?.role ?? null
    } catch {
      /* auth not configured / no session — proceed as guest */
    }
    // Wholesale pricing: the client toggle alone is not enough — the session
    // role must allow it, same rule as the catalog DTO (#49).
    const b2bPricing = payload.b2b === true && (sessionRole === 'b2b' || sessionRole === 'admin')

    try {
      const order = await createOrder({
        userId,
        b2b: b2bPricing,
        name:     payload.name.trim(),
        phone:    payload.phone.trim(),
        email:    payload.email?.trim() || sessionEmail || null,
        city:     payload.city ?? null,
        company:  payload.company ?? null,
        bin:      payload.bin ?? null,
        delivery: payload.delivery ?? null,
        address:  payload.address ?? null,
        comment:  payload.comment?.trim() ?? null,
        payment:  payload.payment ?? null,
        items:    payload.items,
      })
      // Fire-and-forget: a Telegram outage must never block or fail a checkout.
      void notifyOps(formatOrderMessage({
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email?.trim() || null,
        payment: payload.payment,
        delivery: payload.delivery,
        company: payload.company,
        bin: payload.bin,
        city: payload.city,
        comment: payload.comment,
        items: (payload.items ?? []).map((i) => ({ name: i.name, qty: i.qty })),
      }))

      // Save the checkout contacts onto the signed-in user's profile (best
      // effort — the order already succeeded, so a failure here must not fail it).
      if (userId) {
        try {
          await backfillProfileFromOrder(userId, {
            b2b: payload.b2b === true,
            name: payload.name.trim(),
            phone: payload.phone.trim(),
            company: payload.company ?? null,
            bin: payload.bin ?? null,
          })
        } catch (err) {
          console.error('[submitOrder] profile backfill error:', err)
        }
      }

      revalidatePath('/')
      return {
        ok: true,
        message: 'act.orderAccepted',
        params: { num: order.invoiceNumber },
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        orderId: order.id,
      }
    } catch (err) {
      console.error('[submitOrder] order error:', err)
      return { ok: false, message: 'act.orderFailed' }
    }
  }

  // Lightweight leads (callback / booking / quote) — fail open, ops will retry.
  try {
    await createLead({
      kind:    payload.kind,
      name:    payload.name.trim(),
      phone:   payload.phone.trim(),
      email:   payload.email?.trim() ?? null,
      city:    payload.city ?? null,
      comment: payload.comment?.trim() ?? null,
      company:   payload.company,
      bin:       payload.bin,
      payment:   payload.payment,
      delivery:  payload.delivery,
      unit_id:   payload.unit_id,
      date_from: payload.date_from,
      date_to:   payload.date_to,
      address:   payload.address,
      items:     payload.items,
    })
  } catch (err) {
    console.error('[submitOrder] lead error:', err)
  }

  void notifyOps(formatLeadMessage({
    kind: payload.kind,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    city: payload.city,
    comment: payload.comment,
    unitId: payload.unit_id,
    dates: payload.date_from ? `${payload.date_from} → ${payload.date_to ?? '…'}` : null,
  }))

  revalidatePath('/')

  const messages: Record<string, TranslationKey> = {
    callback: 'act.callbackOk',
    booking:  'act.bookingOk',
    quote:    'act.quoteOk',
  }

  return { ok: true, message: messages[payload.kind] ?? 'act.leadOk' }
}

/**
 * Attach the just-placed guest order to the signed-in account (#48). The UUID
 * comes from the buyer's own sessionStorage; "taken" and "not found" collapse
 * into one code so the action can't be used to probe order ids.
 */
export async function claimOrder(
  orderId: string,
): Promise<{ ok: boolean; code: 'claimed' | 'already' | 'unauthenticated' | 'unavailable' }> {
  let userId: string | null = null
  let sessionEmail: string | null = null
  try {
    const session = await auth()
    userId = session?.user?.id ?? null
    sessionEmail = session?.user?.email ?? null
  } catch {
    /* auth not configured — treated as signed out */
  }
  if (!userId) return { ok: false, code: 'unauthenticated' }

  try {
    // Primary path (Google, same tab): claim the exact order whose UUID this
    // browser holds. Absent when the magic link opened a fresh tab — sessionStorage
    // doesn't cross tabs — so it may legitimately be empty here.
    const primary = orderId ? await attachOrderToUser(orderId, userId) : 'notfound'

    // Reliable path for the email flow: attach every unclaimed order under the
    // verified address (proven by Google / the magic link — #48, the email
    // analogue of claim-by-verified-phone). This is what catches *this* order
    // when the UUID was lost to a new tab. Best effort.
    let swept = 0
    if (sessionEmail) {
      try {
        swept = await attachOrdersByEmail(sessionEmail, userId)
      } catch (err) {
        console.error('[claimOrder] email sweep error:', err)
      }
    }

    if (primary === 'claimed' || primary === 'already' || swept > 0) {
      revalidatePath('/account/orders')
      return { ok: true, code: primary === 'already' ? 'already' : 'claimed' }
    }
    return { ok: false, code: 'unavailable' }
  } catch (err) {
    console.error('[claimOrder] error:', err)
    return { ok: false, code: 'unavailable' }
  }
}

export async function trackOrder(
  invoiceNumber: string,
  phone: string,
): Promise<{ found: boolean; order?: TrackedOrder }> {
  // Same shape as a miss — a rate-limited prober learns nothing (#68).
  if (!rateLimit(`track:${clientIpFrom(headers())}`, { limit: 20, windowMs: 60_000 })) {
    return { found: false }
  }
  try {
    const order = await trackOrderByInvoice(invoiceNumber, phone)
    return order ? { found: true, order } : { found: false }
  } catch (err) {
    console.error('[trackOrder] error:', err)
    return { found: false } // uniform response — no enumeration, no error detail
  }
}

/* ── My Garage (#17) — server storage for signed-in users ──────────────────
   Guests keep the localStorage garage; these actions all no-op with
   { signedIn: false } / { ok: false } when there is no session. */

async function garageUserId(): Promise<string | null> {
  try {
    return (await auth())?.user?.id ?? null
  } catch {
    return null // auth not configured — treated as signed out
  }
}

/**
 * One-shot sync on page load: pushes the guest's localStorage vehicles into
 * the account (deduped by VIN, capped) and returns the server list, which
 * becomes the source of truth for the session.
 */
export async function syncGarage(
  local: GarageVehicleInput[],
): Promise<{ signedIn: boolean; vehicles?: GarageVehicleDTO[] }> {
  const userId = await garageUserId()
  if (!userId) return { signedIn: false }
  try {
    const vehicles = await importVehicles(userId, (local ?? []).slice(0, MAX_VEHICLES))
    return { signedIn: true, vehicles }
  } catch (err) {
    console.error('[syncGarage] error:', err)
    return { signedIn: true, vehicles: await listVehicles(userId).catch(() => []) }
  }
}

export async function addGarageVehicle(input: GarageVehicleInput): Promise<{ ok: boolean }> {
  const userId = await garageUserId()
  if (!userId) return { ok: false }
  try {
    return { ok: (await addVehicleSvc(userId, input)) !== null }
  } catch (err) {
    console.error('[addGarageVehicle] error:', err)
    return { ok: false }
  }
}

export async function updateGarageVehicle(
  id: string,
  data: { name?: string; note?: string },
): Promise<{ ok: boolean }> {
  const userId = await garageUserId()
  if (!userId) return { ok: false }
  try {
    return { ok: await updateVehicleSvc(userId, id, data) }
  } catch (err) {
    console.error('[updateGarageVehicle] error:', err)
    return { ok: false }
  }
}

export async function removeGarageVehicle(id: string): Promise<{ ok: boolean }> {
  const userId = await garageUserId()
  if (!userId) return { ok: false }
  try {
    await removeVehicleSvc(userId, id)
    return { ok: true }
  } catch (err) {
    console.error('[removeGarageVehicle] error:', err)
    return { ok: false }
  }
}

export async function submitCallback(formData: FormData) {
  return submitOrder({
    kind:  'callback',
    name:  String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    city:  String(formData.get('city') ?? ''),
  })
}
