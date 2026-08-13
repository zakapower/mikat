import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Микат — времена намаза в браузере',
    template: '%s · Микат',
  },
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
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
