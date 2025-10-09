import { container } from '@/config/inversify/container'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { Auth, UserCredential } from 'firebase/auth'
import { useRegisterSyncApi } from './useRegisterSyncApi'

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

    const handleRegister = async (
        credential: CredentialRegister
    ): Promise<UserCredential> => {
        console.log('credenciales para enviar de payload', credential)
        // debugger
        try {
            // authUseCase.register debería devolver algo como { auth: { session: UserCredential } }
            const payloadData: RegisterFieldsEntity = {
                name: credential.name,
                phone: credential.phone,
                entityType: credential.entityType,
                dni: credential.dni,
            }
            const { session } = await authUseCase.register(credential)
            console.log('session desde el register', session)
            if (session) {
                const { operationType } = session
                if (operationType === 'signIn') {
                    await syncMutation.mutateAsync({
                        session: session,
                        payload: payloadData,
                    })
                    // const authToken = user.getIdToken() // queda como una promesa pendiente
                    // console.log('token obtenido', authToken)
                    // entonces, si iniciamos session al registrarnos y tenemos el objecto user,
                    // debemos guardar ese objecto en la base de datos de nuestra api
                }
            }

            console.log('respuesta desde firebase al registrar', session)

            toast({
                title: '¡Cuenta creada!',
                description:
                    'Tu cuenta ha sido creada exitosamente desde el hook. Serás redirigido.',
            })

            // Devuelvo directamente el UserCredential de Firebase
            return session
        } catch (error) {
            console.error('error al registrar desde el hook', error)
            throw error
        }
    }

    return { handleRegister }
}
