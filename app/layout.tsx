import type { Metadata, Viewport } from 'next'
import { Golos_Text, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingChat } from '@/components/layout/FloatingChat'
import { BottomNav } from '@/components/layout/BottomNav'
import { CartAddedPopup } from '@/components/cart/CartAddedPopup'
import { Providers } from './providers'
import './globals.css'

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-golos',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TulparHub — Запчасти для грузовиков и спецтехники',
  description: 'Запчасти для грузовиков и спецтехники в Казахстане. KAMAZ, Volvo, MAN, DAF, Scania, Shacman. OEM и аналоги, наличие на складах в Алматы, Астане и Шымкенте.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${golos.variable} ${jetbrains.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <FloatingChat />
          <BottomNav />
          <CartAddedPopup />
        </Providers>
      </body>
    </html>
  )
}
