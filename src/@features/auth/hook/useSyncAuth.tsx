import { useQuery } from '@tanstack/react-query'
import { useAxiosInstance } from '@/lib/@axios'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { useMemo } from 'react'

export default function useSyncAuth() {
    const axiosInstance = useAxiosInstance()
    const authUseCase = useMemo(
        () => new AuthRepositoryUseCase(axiosInstance),
        [axiosInstance]
    )

    const { data, isLoading, error } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => authUseCase.currentUser(),
    })

    const { authUser } = data || {}

    return { authUser, isLoading, error }
}
