import type { Metadata } from 'next'
import { Golos_Text, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingChat } from '@/components/layout/FloatingChat'
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
  description: '84 000 артикулов на складах в Алматы, Астане и Ташкенте. KAMAZ, CAT, Komatsu, Shacman, MAZ. OEM и аналоги с гарантией.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${golos.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <FloatingChat />
      </body>
    </html>
  )
}
