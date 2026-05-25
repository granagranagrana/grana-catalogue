import React from 'react'

export const metadata = {
  title: 'GRANA Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
