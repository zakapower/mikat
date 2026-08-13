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
  title: 'Mikat — времена намаза в браузере',
  description:
    'Расширение Chrome и Edge: времена намаза, таймер на иконке и уведомления по вашей локации.',
  // Favicon managed at runtime by theme (like neighbors).
  icons: {},
  openGraph: {
    title: 'Mikat',
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
    <html
      lang="ru"
      data-theme="dark"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon-dark.svg?v=1"
          id="site-favicon"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var th=localStorage.getItem('mikat-theme');if(th!=='dark'&&th!=='light'){th='dark'}document.documentElement.dataset.theme=th;var icon=document.getElementById('site-favicon');if(icon){icon.href=th==='dark'?'/favicon-dark.svg?v=1':'/favicon-light.svg?v=1'}}catch(e){document.documentElement.dataset.theme='dark'}`,
          }}
        />
      </head>
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
