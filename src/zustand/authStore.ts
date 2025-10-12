import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from 'firebase/auth'

// Estados de autenticación
type AuthStatus =
    | 'idle'
    | 'loading'
    | 'authenticated'
    | 'unauthenticated'
    | 'error'

// Estado global de autenticación
interface AuthState {
    // Estado del usuario
    user: AuthUser | null
    firebaseUser: User | null
    token: string | null

    // Estados de la aplicación
    status: AuthStatus
    loading: boolean
    error: string | null

    // Información de la sesión
    isAuthenticated: boolean
    profileComplete: boolean

    // Acciones de autenticación
    setUser: (user: AuthUser | null) => void
    setFirebaseUser: (user: User | null) => void
    setToken: (token: string | null) => void
    setStatus: (status: AuthStatus) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Métodos principales
    login: (user: AuthUser, firebaseUser: User, token: string) => void
    logout: () => void
    updateProfile: (updates: Partial<AuthUser>) => void
    clearError: () => void

    // Métodos de utilidad
    refreshToken: (newToken: string) => void
    checkProfileComplete: () => boolean
}

// Estado inicial
const initialState = {
    user: null,
    firebaseUser: null,
    token: null,
    status: 'idle' as AuthStatus,
    loading: false,
    error: null,
    isAuthenticated: false,
    profileComplete: false,
}

// Store principal de autenticación
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Setters básicos
            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    profileComplete: user?.profile_complete || false,
                }),

            setFirebaseUser: (firebaseUser) => set({ firebaseUser }),

            setToken: (token) => set({ token }),

            setStatus: (status) => set({ status }),

            setLoading: (loading) => set({ loading }),

            setError: (error) => set({ error }),

            // Método de login completo
            login: (user, firebaseUser, token) =>
                set({
                    user,
                    firebaseUser,
                    token,
                    status: 'authenticated',
                    loading: false,
                    error: null,
                    isAuthenticated: true,
                    profileComplete: user.profile_complete || false,
                }),

            // Método de logout
            logout: () =>
                set({
                    ...initialState,
                    status: 'unauthenticated',
                }),

            // Actualizar perfil del usuario
            updateProfile: (updates) => {
                const currentUser = get().user
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...updates }
                    set({
                        user: updatedUser,
                        profileComplete: updatedUser.profile_complete || false,
                    })
                }
            },

            // Limpiar errores
            clearError: () => set({ error: null }),

            // Refrescar token
            refreshToken: (newToken) => set({ token: newToken }),

            // Verificar si el perfil está completo
            checkProfileComplete: () => {
                const user = get().user
                return user?.profile_complete || false
            },
        }),
        {
            name: 'auth-storage', // nombre del localStorage
            storage: createJSONStorage(() => localStorage),
            // Solo persistir datos esenciales, no estados temporales
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                profileComplete: state.profileComplete,
            }),
        }
    )
)

// Selectores útiles para componentes
export const useAuth = () => {
    const store = useAuthStore()
    return {
        user: store.user,
        firebaseUser: store.firebaseUser,
        token: store.token,
        isAuthenticated: store.isAuthenticated,
        loading: store.loading,
        error: store.error,
        status: store.status,
        profileComplete: store.profileComplete,
    }
}

// Selector para acciones
export const useAuthActions = () => {
    const store = useAuthStore()
    return {
        // Métodos principales
        login: store.login,
        logout: store.logout,
        updateProfile: store.updateProfile,
        clearError: store.clearError,
        refreshToken: store.refreshToken,
        checkProfileComplete: store.checkProfileComplete,

        // Setters básicos
        setUser: store.setUser,
        setFirebaseUser: store.setFirebaseUser,
        setToken: store.setToken,
        setStatus: store.setStatus,
        setLoading: store.setLoading,
        setError: store.setError,
    }
}

// Hook para verificar si el usuario es propietario
export const useIsOwner = () => {
    const user = useAuthStore((state) => state.user)
    return user?.entityType?.some((entity) => entity.code === 'owner') || false
}

// Hook para verificar si el usuario es proveedor de servicios
export const useIsServiceProvider = () => {
    const user = useAuthStore((state) => state.user)
    return (
        user?.entityType?.some((entity) => entity.code === 'service') || false
    )
}

// Hook para obtener el tipo de entidad principal
export const useEntityType = () => {
    const user = useAuthStore((state) => state.user)
    return user?.entityType?.[0]?.code || null
}
