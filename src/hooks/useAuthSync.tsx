'use client'

import { useEffect } from 'react'
import { onIdTokenChanged, signOut } from 'firebase/auth'
import { useFirebase } from '@/firebase/provider'
import { useAuthStore, useAuthActions } from '@/zustand/authStore'
import { mapUserFromApi } from '@/@features/auth/auth.mapper'

/**
 * Hook que sincroniza el estado global de autenticación con Firebase Auth
 * Se ejecuta automáticamente cuando cambia el estado de autenticación de Firebase
 */
export function useAuthSync() {
    const { auth } = useFirebase()
    const {
        setUser,
        setFirebaseUser,
        setToken,
        setStatus,
        setLoading,
        setError,
        logout,
    } = useAuthActions()

    useEffect(() => {
        if (!auth) return

        setLoading(true)
        setStatus('loading')

        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Usuario autenticado en Firebase
                    setFirebaseUser(firebaseUser)

                    // Obtener token
                    const token = await firebaseUser.getIdToken()
                    setToken(token)

                    // Aquí podrías hacer una llamada a tu API para obtener los datos del usuario
                    // Por ahora, creamos un usuario básico desde Firebase
                    const basicUser = {
                        id: parseInt(firebaseUser.uid) || 0,
                        email: firebaseUser.email || '',
                        name: firebaseUser.displayName || '',
                        entityType: [], // Se llenará cuando se sincronice con la API
                        profile: null,
                        profile_complete: false,
                    }

                    setUser(basicUser)
                    setStatus('authenticated')
                } else {
                    // Usuario no autenticado
                    logout()
                    setStatus('unauthenticated')
                }
            } catch (error) {
                console.error(
                    'Error en sincronización de autenticación:',
                    error
                )
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Error de autenticación'
                )
                setStatus('error')
            } finally {
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [
        auth,
        setUser,
        setFirebaseUser,
        setToken,
        setStatus,
        setLoading,
        setError,
        logout,
    ])

    // Función para cerrar sesión
    const handleLogout = async () => {
        try {
            setLoading(true)
            if (auth) {
                await signOut(auth)
            }
            logout()
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error al cerrar sesión'
            )
        } finally {
            setLoading(false)
        }
    }

    return {
        handleLogout,
    }
}

/**
 * Hook para sincronizar datos del usuario desde la API
 * Se debe llamar después del login exitoso
 */
export function useUserDataSync() {
    const { setUser, setError } = useAuthActions()
    const { user } = useAuthStore()


    const syncUserData = async (apiUserData: any) => {
        try {
            // Mapear datos de la API al formato esperado
            const mappedUser = mapUserFromApi(apiUserData)
            setUser(mappedUser)
        } catch (error) {
            console.error('Error al sincronizar datos del usuario:', error)
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error al sincronizar datos'
            )
        }
    }

    return {
        syncUserData,
        currentUser: user,
    }
}
