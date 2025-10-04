import type { Metadata } from 'next'
import './globals.css'

import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { FirebaseClientProvider } from '@/firebase'
import { ProviderInversify } from '@/config/inversify/ProviderInversify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Providers } from '@/providers/Providers'
export const metadata: Metadata = {
    title: 'PawsHealth Digital',
    description: 'Carnet de salud digital para tus mascotas',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const queryClient = new QueryClient()

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
                <Providers>
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
                </Providers>

                {/* <ProviderInversify>
                    <QueryClientProvider client={queryClient}>
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
                    </QueryClientProvider>
                </ProviderInversify> */}
            </body>
        </html>
    )
}
