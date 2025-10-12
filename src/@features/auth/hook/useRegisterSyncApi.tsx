import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCredential } from 'firebase/auth'

// debo hacer llegar hasta aqui el resto del payload

export function useRegisterSyncApi() {
    const mutation = useMutation({
        mutationFn: async ({
            session,
            payload,
        }: {
            session: UserCredential
            payload: RegisterFieldsEntity
        }) => {
            if (!session) return
            const { user } = session

            const idToken = await user.getIdToken()
            const apiUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL ||
                'http://localhost:8000/api'

            const { data, status } = await axios.post(
                `${apiUrl}/auth/register-sync`,
                {
                    entityData: payload,
                },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    },
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
