'use client'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Do not pass a `session` prop here. MetricaIdentity relies on useSession()
  // starting at status 'loading' and resolving asynchronously, so the Metrica
  // tag (loaded afterInteractive) exists by the time it sends setUserID/params.
  // SSR-hydrating the session would resolve it synchronously on first render,
  // firing those calls before window.ym exists — and they'd be silently dropped.
  return <SessionProvider>{children}</SessionProvider>
}
