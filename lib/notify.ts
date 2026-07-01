import { fmtKZT } from '@/lib/utils'

// Ops notifications via a Telegram bot. Inert until TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID are set (create the bot via @BotFather, add it to the ops
// group, use the group's chat id). Always fire-and-forget from call sites:
// a Telegram outage must never block or fail a checkout.

function esc(s: string | null | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function notifyOps(html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return // not configured — silent no-op

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) console.error('[notifyOps] telegram error:', res.status, await res.text())
  } catch (err) {
    console.error('[notifyOps] failed:', err)
  }
}

export interface OrderNotification {
  invoiceNumber: string
  total: number
  name: string
  phone: string
  payment?: string | null
  delivery?: string | null
  company?: string | null
  bin?: string | null
  city?: string | null
  comment?: string | null
  items: Array<{ name: string; qty: number }>
}

export function formatOrderMessage(o: OrderNotification): string {
  const lines = [
    `🧾 <b>Новый заказ ${esc(o.invoiceNumber)}</b> — <b>${fmtKZT(o.total)}</b>`,
    `👤 ${esc(o.name)} · ${esc(o.phone)}`,
  ]
  if (o.company) lines.push(`🏢 ${esc(o.company)}${o.bin ? ` · БИН ${esc(o.bin)}` : ''}`)
  const meta = [o.payment, o.delivery, o.city].filter(Boolean).map(esc).join(' · ')
  if (meta) lines.push(`💳 ${meta}`)
  if (o.comment) lines.push(`💬 ${esc(o.comment)}`)

  const shown = o.items.slice(0, 10)
  lines.push('', ...shown.map((i) => `· ${esc(i.name)} ×${i.qty}`))
  if (o.items.length > shown.length) lines.push(`… и ещё ${o.items.length - shown.length} поз.`)

  const base = process.env.AUTH_URL
  if (base) lines.push('', `${base.replace(/\/$/, '')}/admin`)
  return lines.join('\n')
}

export interface LeadNotification {
  kind: string
  name: string
  phone: string
  city?: string | null
  comment?: string | null
  unitId?: string | null
  dates?: string | null
}

const LEAD_KIND_RU: Record<string, string> = {
  callback: 'Обратный звонок',
  booking: 'Бронь аренды',
  quote: 'Запрос цены',
}

export function formatLeadMessage(l: LeadNotification): string {
  const lines = [
    `📞 <b>${esc(LEAD_KIND_RU[l.kind] ?? l.kind)}</b>`,
    `👤 ${esc(l.name)} · ${esc(l.phone)}`,
  ]
  if (l.city) lines.push(`📍 ${esc(l.city)}`)
  if (l.unitId) lines.push(`🚜 ${esc(l.unitId)}${l.dates ? ` · ${esc(l.dates)}` : ''}`)
  if (l.comment) lines.push(`💬 ${esc(l.comment)}`)
  return lines.join('\n')
}
