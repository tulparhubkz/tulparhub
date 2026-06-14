import { Suspense } from 'react'
import CatalogInner from './CatalogInner'

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0' }}>Загрузка каталога...</div>}>
      <CatalogInner />
    </Suspense>
  )
}
