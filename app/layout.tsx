import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlowSpace — Personal Mental OS',
  description: 'Your personal command center for clarity, execution, and self-reflection.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
