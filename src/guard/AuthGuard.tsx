'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Lottie from 'lottie-react'
import useSyncAuth from '@/@features/auth/hook/useSyncAuth'
import { useAuthActions } from '@/zustand/authStore'
import loadingDog from '../assets/animations/loadingDog.json'

interface AuthGuardProps {
    children: ReactNode
}

const ONBOARDING_PATH = '/signup/onboarding/complete-profile'

export default function AuthGuard({ children }: AuthGuardProps) {
    const { authUser, isLoading } = useSyncAuth()
    const { setUser } = useAuthActions()
    const router = useRouter()
    const pathname = usePathname()

    const shouldRedirectToOnboarding = useMemo(() => {
        if (!authUser) return false

        const isProfileIncomplete = authUser.profile_complete === false
        const isOnboardingPage = pathname === ONBOARDING_PATH

        return isProfileIncomplete && !isOnboardingPage
    }, [authUser, pathname])

    useEffect(() => {
        if (isLoading) return

        if (authUser) {
            setUser(authUser)
            console.log('Usuario hidratado correctamente')

            if (shouldRedirectToOnboarding) {
                router.replace(ONBOARDING_PATH)
            }
        }
    }, [authUser, isLoading, setUser, router, shouldRedirectToOnboarding])

    const showLoading = isLoading || shouldRedirectToOnboarding

    if (showLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-100">
                <div className="w-100 h-100">
                    <Lottie animationData={loadingDog} loop />
                </div>
            </div>
        )
    }

    return <>{children}</>
}
