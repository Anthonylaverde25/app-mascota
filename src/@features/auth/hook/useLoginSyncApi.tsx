import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { UserCredential } from 'firebase/auth'
import { useAxiosInstance } from '@/lib/@axios'

// debo hacer llegar hasta aqui el resto del payload

export function useLoginSyncApi() {
    const axiosInstance = useAxiosInstance()

    const mutation = useMutation({
        mutationFn: async ({ uid }: { uid: string }) => {
            const { data } = await axiosInstance.post('/auth/login-sync', {
                uid: uid,
            })

            console.log('data desde el login', data)

            if (!data) {
                throw new Error('Error al sincronizar usuario con la API')
            }

            return data
        },
        retry: 2,
    })

    return mutation
}
