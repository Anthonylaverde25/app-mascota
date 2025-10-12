// src/context/Auth/AuthContext.tsx
'use client'

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import { User, onIdTokenChanged } from 'firebase/auth'
import { useFirebase } from '@/firebase/provider' // Hook que expone auth desde FirebaseClientProvider

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { auth } = useFirebase() // Obtenemos el auth inicializado por FirebaseClientProvider
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!auth) return
        console.log('hola')

        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)

            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken()
                console.log('token dsde el contsxto', idToken)
                setToken(idToken)
            } else {
                setToken(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [auth])

    return (
        <AuthContext.Provider value={{ user, token, loading }}>
            {children}
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
