// import { container } from '@/config/inversify/container'
// import { toast } from '@/hooks/use-toast'
// import { AuthRepositoryUseCase } from '../use-case/authUseCase'
// import { UserCredential } from 'firebase/auth'
// import { useLoginSyncApi } from './useLoginSyncApi'
// import { useAuthActions } from '@/zustand/authStore'
// import { mapUserFromApi } from '../auth.mapper'

// export default function useLogin() {
//     const authUseCase = container.get(AuthRepositoryUseCase)
//     const syncMutation = useLoginSyncApi()
//     const { login, setLoading, setError, clearError } = useAuthActions()

//     const handleLogin = async (
//         credential: CredentialLogin
//     ): Promise<UserCredential> => {
//         try {
//             setLoading(true)
//             clearError()

//             const { session } = await authUseCase.login(credential)
//             const uid = session?.user?.uid

//             if (uid) {
//                 // Obtener token de Firebase primero
//                 const token = await session.user.getIdToken()

//                 // Sincronizar con la API para obtener datos completos del usuario
//                 const apiResponse = await syncMutation.mutateAsync({
//                     uid,
//                     token,
//                 })

//                 if (apiResponse) {
//                     // Mapear datos de la API
//                     const mappedUser = mapUserFromApi(apiResponse)
//                     console.log('mapper del user al hacer login', mappedUser)

//                     // Actualizar estado global
//                     login(mappedUser, session.user, token)

//                     toast({
//                         title: '¡Inicio de sesión exitoso!',
//                         description: 'Has iniciado sesión correctamente.',
//                     })
//                 }
//             }

//             return session
//         } catch (error) {
//             console.error('Error al iniciar sesión:', error)
//             setError(
//                 error instanceof Error
//                     ? error.message
//                     : 'Error al iniciar sesión'
//             )

//             toast({
//                 title: 'Error de autenticación',
//                 description:
//                     'No se pudo iniciar sesión. Verifica tus credenciales.',
//                 variant: 'destructive',
//             })

//             throw error
//         } finally {
//             setLoading(false)
//         }
//     }

//     return {
//         handleLogin,
//         isLoading: syncMutation.isPending,
//         error: syncMutation.error,
//     }
// }

import { useMemo } from 'react'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { useLoginSyncApi } from './useLoginSyncApi'
import { useAuthActions } from '@/zustand/authStore'
import { mapUserFromApi } from '../auth.mapper'
import { useAxiosInstance } from '@/lib/@axios'

export default function useLogin() {
    const axiosInstance = useAxiosInstance()
    const authUseCase = useMemo(
        () => new AuthRepositoryUseCase(axiosInstance),
        [axiosInstance]
    )
    const syncMutation = useLoginSyncApi()
    const { login, setLoading, setError, clearError } = useAuthActions()

    const handleLogin = async (credential: CredentialLogin) => {
        try {
            setLoading(true)
            clearError()

            const { session } = await authUseCase.login(credential)
            const uid = session?.user?.uid

            if (uid) {
                const token = await session.user.getIdToken()

                const apiResponse = await syncMutation.mutateAsync({
                    uid,
                    token,
                })

                if (apiResponse) {
                    const mappedUser = mapUserFromApi(apiResponse)
                    login(mappedUser, session.user, token)

                    toast({
                        title: '¡Inicio de sesión exitoso!',
                        description: 'Has iniciado sesión correctamente.',
                    })
                }
            }

            return session
        } catch (error) {
            console.error('Error al iniciar sesión:', error)
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error al iniciar sesión'
            )

            toast({
                title: 'Error de autenticación',
                description:
                    'No se pudo iniciar sesión. Verifica tus credenciales.',
                variant: 'destructive',
            })

            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        handleLogin,
        isLoading: syncMutation.isPending,
        error: syncMutation.error,
    }
}
