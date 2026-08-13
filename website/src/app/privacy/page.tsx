import type { Metadata } from 'next'
import PrivacyPage from './privacy-client'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for the Mikat browser extension.',
}

export default function Page() {
  return <PrivacyPage />
}
