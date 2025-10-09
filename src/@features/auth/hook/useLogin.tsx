import { container } from '@/config/inversify/container'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { UserCredential } from 'firebase/auth'
import { useLoginSyncApi } from './useLoginSyncApi'

export default function useLogin() {
    const authUseCase = container.get(AuthRepositoryUseCase)
    const syncMutation = useLoginSyncApi()

    const handleLogin = async (
        credential: CredentialLogin
    ): Promise<UserCredential> => {
        try {
            const { session } = await authUseCase.login(credential)
            const uid = session?.user?.uid
            if (uid) {
                await syncMutation.mutateAsync({ uid })
            }
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

    return { handleLogin }
}
