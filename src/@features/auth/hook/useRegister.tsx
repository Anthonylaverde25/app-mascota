import { container } from '@/config/inversify/container'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { Auth } from 'firebase/auth'

interface CredentialRegister {
    auth: Auth
    email: string
    password: string
}

export default function useRegister() {
    const authUseCase = container.get(AuthRepositoryUseCase)

    const handleRegister = async (
        credential: CredentialRegister
    ): Promise<any> => {
        try {
            const response = await authUseCase.register(credential)
            toast({
                title: '¡Cuenta creada!',
                description:
                    'Tu cuenta ha sido creada exitosamente desde ek hook. Serás redirigido.',
            })
            return response
        } catch (error) {
            console.log('error al registrar desde el hook', error)
            throw error
        }
    }

    return { handleRegister }
}
