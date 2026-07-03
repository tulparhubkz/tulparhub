'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

const ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID

export function YandexMetrica() {
  const pathname = usePathname()

  // defer:true disables Metrica's own auto page-view, so THIS effect owns every
  // hit (including the first) — no double counting on initial load.
  useEffect(() => {
    if (ID) trackPageView(pathname)
  }, [pathname])

  if (!ID) return null

  return (
    <>
      <Script
        id="ym-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${Number(ID)}, "init", {
              defer:true,
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${Number(ID)}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  )
}
