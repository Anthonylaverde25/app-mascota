import { container } from '@/config/inversify/container'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { Auth, UserCredential } from 'firebase/auth'
import { useRegisterSyncApi } from './useRegisterSyncApi'
import { useAuthActions } from '@/zustand/authStore'
import { mapUserFromApi } from '../auth.mapper'

interface CredentialRegister {
    auth: Auth
    email: string
    password: string
    entityType: EntityType
    dni?: string
    phone?: string
    name: string
}

export default function useRegister() {
    const authUseCase = container.get(AuthRepositoryUseCase)
    const syncMutation = useRegisterSyncApi()
    const { login, setLoading, setError, clearError } = useAuthActions()

    const handleRegister = async (
        credential: CredentialRegister
    ): Promise<UserCredential> => {
        try {
            setLoading(true)
            clearError()

            const payloadData: RegisterFieldsEntity = {
                name: credential.name,
                phone: credential.phone,
                entityType: credential.entityType,
                dni: credential.dni,
            }

            const { session } = await authUseCase.register(credential)

            if (session) {
                const { operationType } = session
                if (operationType === 'signIn') {
                    // Sincronizar con la API para crear/actualizar el usuario
                    const apiResponse = await syncMutation.mutateAsync({
                        session: session,
                        payload: payloadData,
                    })

                    if (apiResponse) {
                        // Mapear datos de la API
                        const mappedUser = mapUserFromApi(apiResponse)

                        // Obtener token de Firebase
                        const token = await session.user.getIdToken()

                        // Actualizar estado global
                        login(mappedUser, session.user, token)

                        toast({
                            title: '¡Cuenta creada exitosamente!',
                            description:
                                'Tu cuenta ha sido creada y has iniciado sesión automáticamente.',
                        })
                    }
                }
            }

            return session
        } catch (error) {
            console.error('Error al registrar usuario:', error)
            setError(
                error instanceof Error
                    ? error.message
                    : 'Error al registrar usuario'
            )

            toast({
                title: 'Error de registro',
                description: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
                variant: 'destructive',
            })

            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        handleRegister,
        isLoading: syncMutation.isPending,
        error: syncMutation.error,
    }
}
