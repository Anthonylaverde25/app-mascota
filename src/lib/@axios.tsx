import { useAuthContext } from '@/context/Auth/AuthContext'
import axios, { AxiosInstance } from 'axios'
import { useMemo } from 'react'

export function useAxiosInstance(): AxiosInstance {
    const { token } = useAuthContext()

    // Detecta si estamos en server o cliente
    const apiUrl =
        typeof window === 'undefined'
            ? process.env.API_BASE_URL_PRIVATE
            : process.env.NEXT_PUBLIC_API_BASE_URL

    // ⚙️ useMemo para que la instancia no se recree en cada render
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: apiUrl,
        })

        // Interceptor que agrega el Bearer token si existe
        instance.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            } else {
                delete config.headers.Authorization
            }
            return config
        })

        return instance
    }, [token, apiUrl]) // 🔁 se actualiza cuando cambia el token o la URL

    return axiosInstance
}
