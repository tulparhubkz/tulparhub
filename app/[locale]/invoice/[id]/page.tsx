import { notFound } from 'next/navigation'
import { getOrderWithItems } from '@/lib/services/orders'
import { auth } from '@/lib/auth'
import { fmtKZT } from '@/lib/utils'
import { PrintButton } from './PrintButton'

export const dynamic = 'force-dynamic'

// Financial document — intentionally Russian-only (KZ B2B standard), regardless
// of UI locale. Access control (#67): guest orders are reachable by their
// unguessable UUID; orders placed by a signed-in user additionally require that
// user's session (or an admin). Supplier requisites come from env; placeholders
// make the doc obviously a draft until the real ones are configured (CEO).
const SUPPLIER = {
  name: process.env.INVOICE_COMPANY ?? 'ТОО «TulparHub» (реквизиты не настроены)',
  bin: process.env.INVOICE_BIN ?? '____________',
  address: process.env.INVOICE_ADDRESS ?? 'г. Алматы, ул. ____________',
  iik: process.env.INVOICE_IIK ?? 'KZ__________________',
  bank: process.env.INVOICE_BANK ?? 'АО «____________»',
  bik: process.env.INVOICE_BIK ?? '________',
  kbe: process.env.INVOICE_KBE ?? '17',
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderWithItems(id)
  if (!order) notFound()

  if (order.userId) {
    let viewer: { id?: string; role?: string } | undefined
    try {
      viewer = (await auth())?.user as { id?: string; role?: string } | undefined
    } catch {
      /* auth not configured — treated as signed out */
    }
    // 404, not 403: an outsider must not learn that the id exists.
    if (!viewer || (viewer.id !== order.userId && viewer.role !== 'admin')) notFound()
  }

  const vat = Math.round(order.total * 12 / 112)

  return (
    <main className="inv">
      <style>{`
        .inv { max-width: 800px; margin: 0 auto; padding: 32px 20px 60px; color: #111; font-size: 14px; background: #fff; }
        .inv-actions { display: flex; justify-content: flex-end; margin-bottom: 18px; }
        .inv-print { padding: 10px 18px; background: var(--accent, #db0a40); color: #fff; border: none; border-radius: 9px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .inv h1 { font-size: 19px; font-weight: 800; margin: 18px 0 4px; }
        .inv-warn { border: 1.5px solid #f59e0b; background: #fffbeb; color: #92400e; border-radius: 8px; padding: 8px 12px; font-size: 12px; margin-bottom: 14px; }
        .inv-req { width: 100%; border-collapse: collapse; margin: 14px 0; }
        .inv-req td { border: 1px solid #333; padding: 6px 10px; vertical-align: top; }
        .inv-req .lbl { font-size: 11px; color: #555; }
        .inv-party { margin: 10px 0; line-height: 1.55; }
        .inv-party b { display: inline-block; min-width: 92px; }
        .inv-items { width: 100%; border-collapse: collapse; margin: 16px 0 8px; }
        .inv-items th, .inv-items td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        .inv-items th { font-size: 12px; background: #f3f4f6; }
        .inv-items .num, .inv-items .qty { text-align: center; white-space: nowrap; }
        .inv-items .money { text-align: right; white-space: nowrap; }
        .inv-totals { margin-left: auto; text-align: right; line-height: 1.7; }
        .inv-totals b { font-size: 16px; }
        .inv-note { margin-top: 22px; font-size: 12px; color: #444; line-height: 1.55; border-top: 1px solid #999; padding-top: 10px; }
        .inv-sign { display: flex; gap: 60px; margin-top: 34px; }
        .inv-sign div { flex: 1; border-top: 1px solid #333; padding-top: 6px; font-size: 12px; color: #444; }
        @media print {
          header, footer, .foot, .hdr, .bottomnav, .float-chat, .inv-actions, .inv-warn { display: none !important; }
          .inv { padding: 0; font-size: 12.5px; }
          body { background: #fff; }
        }
      `}</style>

      <div className="inv-actions"><PrintButton /></div>

      {!process.env.INVOICE_BIN && (
        <div className="inv-warn">Черновик: реквизиты поставщика не настроены (env INVOICE_*).</div>
      )}

      <table className="inv-req">
        <tbody>
          <tr>
            <td colSpan={2}>
              <div className="lbl">Бенефициар</div>
              {SUPPLIER.name}<br />БИН {SUPPLIER.bin}
            </td>
            <td>
              <div className="lbl">ИИК</div>
              {SUPPLIER.iik}
            </td>
            <td>
              <div className="lbl">КБе</div>
              {SUPPLIER.kbe}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className="lbl">Банк бенефициара</div>
              {SUPPLIER.bank}
            </td>
            <td colSpan={2}>
              <div className="lbl">БИК</div>
              {SUPPLIER.bik}
            </td>
          </tr>
        </tbody>
      </table>

      <h1>Счёт на оплату № {order.invoiceNumber} от {fmtDate(order.createdAt)}</h1>

      <div className="inv-party">
        <div><b>Поставщик:</b> {SUPPLIER.name}, БИН {SUPPLIER.bin}, {SUPPLIER.address}</div>
        <div>
          <b>Покупатель:</b>{' '}
          {order.company ? `${order.company}${order.bin ? `, БИН/ИИН ${order.bin}` : ''}, ` : ''}
          {order.customerName}, тел. {order.customerPhone}
          {order.customerEmail ? `, ${order.customerEmail}` : ''}
        </div>
      </div>

      <table className="inv-items">
        <thead>
          <tr>
            <th className="num">№</th>
            <th>Наименование</th>
            <th className="qty">Кол-во</th>
            <th className="qty">Ед.</th>
            <th className="money">Цена</th>
            <th className="money">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={it.id}>
              <td className="num">{i + 1}</td>
              <td>{it.oem ? `${it.oem} — ` : ''}{it.name}</td>
              <td className="qty">{it.qty}</td>
              <td className="qty">шт</td>
              <td className="money">{fmtKZT(it.price)}</td>
              <td className="money">{fmtKZT(it.price * it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inv-totals">
        <div>Итого: {fmtKZT(order.total)}</div>
        <div>В том числе НДС 12%: {fmtKZT(vat)}</div>
        <div><b>К оплате: {fmtKZT(order.total)}</b></div>
      </div>

      <div className="inv-note">
        Всего наименований {order.items.length}, на сумму {fmtKZT(order.total)}.<br />
        Оплата данного счёта означает согласие с условиями поставки. Счёт действителен в течение 3 (трёх)
        банковских дней. Товар отпускается после поступления оплаты на расчётный счёт Поставщика.
      </div>

      <div className="inv-sign">
        <div>Исполнитель / Руководитель</div>
        <div>М.П.</div>
      </div>
    </main>
  )
}
