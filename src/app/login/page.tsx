'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/firebase'
import { AuthLayout, LoginForm } from '@/components/pages/auth'

export default function LoginPage() {
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
            title="¡Bienvenido de Nuevo!"
            subtitle="Inicia sesión para gestionar la salud de tus mascotas."
            footerText="¿No tienes una cuenta?"
            footerLinkText="Regístrate"
            footerLinkHref="/signup"
        >
            <LoginForm />
        </AuthLayout>
    )
}
