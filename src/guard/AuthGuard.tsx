import useSyncAuth from '@/@features/auth/hook/useSyncAuth'
import { useAuthActions } from '@/zustand/authStore'
import { ReactNode, useEffect } from 'react'
import loadingDog from '../assets/animations/loadingDog.json'
import Lottie from 'lottie-react'

interface AuthGuardProps {
    children: ReactNode
    authContext: AuthContextType
}

export default function AuthGuard({ children, authContext }: AuthGuardProps) {
    const { authUser, isLoading, error } = useSyncAuth()
    const { setUser } = useAuthActions()

    useEffect(() => {
        if (authUser) {
            setUser(authUser)
            console.log('usuario hidratado correctamente')
        }
    }, [authUser])

    if (isLoading)
        return (
            <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-100">
                <div className="w-100 h-100">
                    <Lottie animationData={loadingDog} loop={true} />
                </div>
            </div>
        )

    return <>{children}</>
}
