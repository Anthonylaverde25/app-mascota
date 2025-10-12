'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/firebase'
import { AuthLayout, SignupForm } from '@/components/pages/auth'

export default function SignupPage() {
    const { user, isUserLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/')
        }
    }, [user, isUserLoading, router])

    if (isUserLoading || user) {
        return (
            <div className="flex justify-center items-center h-screen">
                Cargando...
            </div>
        )
    }

    return (
        <AuthLayout
            title="Crea una cuenta"
            subtitle="Introduce tus datos para crear tu cuenta"
            footerText="¿Ya tienes una cuenta?"
            footerLinkText="Inicia sesión"
            footerLinkHref="/login"
        >
            <SignupForm />
        </AuthLayout>
    )
}
