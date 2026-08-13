import type { Metadata } from 'next'
import { IBM_Plex_Sans, Literata } from 'next/font/google'
import './globals.css'

const sans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-face',
  display: 'swap',
})

const display = Literata({
  subsets: ['latin', 'cyrillic'],
  weight: ['600', '700'],
  variable: '--font-display-face',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Микат — времена намаза в браузере',
  description:
    'Расширение Chrome и Edge: времена намаза, таймер на иконке и уведомления по вашей локации.',
  openGraph: {
    title: 'Микат',
    description: 'Времена намаза всегда под рукой',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" data-theme="dark" className={`${sans.variable} ${display.variable}`}>
      <body
        style={
          {
            '--font': 'var(--font-sans-face), "Segoe UI", sans-serif',
            '--font-display': 'var(--font-display-face), Georgia, serif',
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
