// src/components/Providers.tsx
'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProviderInversify } from '@/config/inversify/ProviderInversify'
import { AuthProvider } from '@/context/Auth/AuthContext'

export function Providers({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient()

    return (
        <ProviderInversify>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ProviderInversify>
    )
}
