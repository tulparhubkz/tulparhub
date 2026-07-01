// The real root layout (html/body, fonts, providers) lives in
// app/[locale]/layout.tsx so it can render the correct <html lang> per locale.
// This root just passes children through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
