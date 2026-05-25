import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'GRANA — Poivres d\'exception',
    template: '%s — GRANA',
  },
  description: 'Catalogue B2B des poivres d\'exception GRANA. Costa Rica · Tamil Nadu · Kerala.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
