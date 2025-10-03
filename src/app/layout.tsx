import type { Metadata } from 'next'
import './globals.css'

import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { FirebaseClientProvider } from '@/firebase'
import { container } from '@/config/inversify/container'
import { ProviderInversify } from '@/config/inversify/ProviderInversify'

export const metadata: Metadata = {
    title: 'PawsHealth Digital',
    description: 'Carnet de salud digital para tus mascotas',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className={cn(
                    'min-h-screen bg-background font-body antialiased'
                )}
            >
                <ProviderInversify container={container}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <FirebaseClientProvider>
                            <div className="relative flex min-h-screen flex-col">
                                <Header />
                                <main className="flex-1">{children}</main>
                            </div>
                            <Toaster />
                        </FirebaseClientProvider>
                    </ThemeProvider>
                </ProviderInversify>
            </body>
        </html>
    )
}
