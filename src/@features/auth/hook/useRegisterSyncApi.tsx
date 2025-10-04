import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCredential } from 'firebase/auth'

export function useRegisterSyncApi() {
    const mutation = useMutation({
        mutationFn: async (session: UserCredential) => {
            if (!session) return
            const { user } = session

            const regiterData = {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
            }

            const idToken = await user.getIdToken()
            const { data, status } = await axios.post(
                'http://localhost:8000/api/auth/register-sync',
                regiterData,
                {
                    headers: { Authorization: `Bearer ${idToken}` },
                }
            )

            if (!data) {
                throw new Error('Error al sincronizar usuario con la API')
            }

            return data
        },
        retry: 2,
    })

    return mutation
}
