import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCredential } from 'firebase/auth'
import { mapUserFromApi } from '../auth.mapper'

// debo hacer llegar hasta aqui el resto del payload

export function useLoginSyncApi() {
    const mutation = useMutation({
        mutationFn: async ({ uid, token }: { uid: string; token: string }) => {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL ||
                'http://localhost:8000/api'

            const { data } = await axios.post(
                `${apiUrl}/auth/login-sync`,
                {
                    uid: uid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log('data desde el login', data)
            const user = mapUserFromApi(data)
            console.log('user mapeado', user)

            if (!data) {
                throw new Error('Error al sincronizar usuario con la API')
            }

            return data
        },
        retry: 2,
    })

    return mutation
}
