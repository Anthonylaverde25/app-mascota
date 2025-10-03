import axios from 'axios'

// Detecta si estamos en server o cliente
const apiUrl =
    typeof window === 'undefined'
        ? process.env.API_BASE_URL_PRIVATE
        : process.env.NEXT_PUBLIC_API_BASE_URL

const axiosInstance = axios.create({
    baseURL: apiUrl,
})

// Función auxiliar para obtener el token actual
const getToken = (): string | null => {
    try {
        if (typeof window !== 'undefined') {
            const item = window.localStorage.getItem('jwt_access_token')
            return item ? JSON.parse(item) : null
        }
        return null
    } catch (error) {
        console.error('Error getting token from localStorage:', error)
        return null
    }
}

// Interceptor que agrega el Bearer token a cada request
axiosInstance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
