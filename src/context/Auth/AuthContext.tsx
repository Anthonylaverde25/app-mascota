// src/context/Auth/AuthContext.tsx
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, useAuthActions, useAuthStore } from '@/zustand/authStore'
import { useAuthSync } from '@/hooks/useAuthSync'
import { User } from 'firebase/auth'
import useSyncAuth from '@/@features/auth/hook/useSyncAuth'
import AuthGuard from '@/guard/AuthGuard'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    

    const authState = useAuth()
    const authActions = useAuthActions()

    // Sincronizar con Firebase Auth
    // useAuthSync()

    // console.log('user auth desde el contexto', user)
    const contextValue: AuthContextType = {
        ...authState,
        ...authActions,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            <AuthGuard authContext={contextValue}> {children}</AuthGuard>
        </AuthContext.Provider>
    )
}

// Hook para usar el contexto en cualquier componente
export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider')
    }
    return context
}

// Hook de conveniencia que combina el contexto con el estado global
export function useAuthWithContext() {
    const context = useAuthContext()
    const zustandState = useAuth()
    const zustandActions = useAuthActions()

    return {
        ...context,
        ...zustandState,
        ...zustandActions,
    }
}
