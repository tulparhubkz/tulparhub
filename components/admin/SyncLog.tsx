'use client'

interface Row {
  id: string
  source: string
  status: string
  startedAt: string
  finishedAt: string
  rowsRead: number
  partsUpserted: number
  stockUpserted: number
  error: string | null
}

const STATUS_RU: Record<string, string> = { running: 'Выполняется', success: 'Успешно', error: 'Ошибка' }

export function SyncLog({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <div className="sl-empty">Импортов ещё не было.<style jsx>{`.sl-empty{padding:48px;text-align:center;color:var(--ink-3);background:var(--surf);border:1.5px solid var(--line);border-radius:16px}`}</style></div>
  }
  return (
    <div className="sl">
      <table>
        <thead>
          <tr><th>Начат</th><th>Источник</th><th>Статус</th><th>Строк</th><th>Деталей</th><th>Остатков</th><th>Ошибка</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="mono">{r.startedAt}</td>
              <td>{r.source.toUpperCase()}</td>
              <td><span className={`pill st-${r.status}`}>{STATUS_RU[r.status] ?? r.status}</span></td>
              <td className="num">{r.rowsRead.toLocaleString('ru-RU')}</td>
              <td className="num">{r.partsUpserted.toLocaleString('ru-RU')}</td>
              <td className="num">{r.stockUpserted.toLocaleString('ru-RU')}</td>
              <td className="err">{r.error || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .sl { overflow-x: auto; background: var(--surf); border: 1.5px solid var(--line); border-radius: 14px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; padding: 12px 14px; color: var(--ink-3); font-weight: 600; font-size: 12px; border-bottom: 1.5px solid var(--line); white-space: nowrap; }
        td { padding: 12px 14px; border-bottom: 1px solid var(--line); color: var(--ink); white-space: nowrap; }
        tr:last-child td { border-bottom: none; }
        .mono { font-family: var(--font-jetbrains, monospace); color: var(--ink-2); }
        .num { text-align: right; font-variant-numeric: tabular-nums; }
        .err { color: #b91c1c; white-space: normal; max-width: 280px; }
        .pill { font-size: 11px; font-weight: 700; padding: 4px 9px; border-radius: 999px; }
        .st-running { background: #eef2ff; color: #4338ca; }
        .st-success { background: #f0fdf4; color: #15803d; }
        .st-error { background: #fef2f2; color: #b91c1c; }
      `}</style>
    </div>
  )
}
