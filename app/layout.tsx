import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/lib/user-context'
import { BusinessesProvider } from '@/lib/businesses-context'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'ThriveOS — Your All-in-One Life & Business Platform',
  description: 'ThriveOS combines Bizbox and Lifebud to help you build a thriving business and a fulfilling life — all in one beautiful platform.',
  keywords: 'productivity, business, wellness, habits, goals, AI assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <UserProvider>
          <AuthProvider>
            <BusinessesProvider>
              {children}
            </BusinessesProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  )
}
