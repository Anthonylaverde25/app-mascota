'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/firebase'
import { useToast } from '@/hooks/use-toast'
import useLogin from '@/@features/auth/hook/useLogin'
import { GoogleIcon } from './GoogleIcon'

const formSchema = z.object({
    email: z
        .string()
        .email('Por favor, introduce un correo electrónico válido.'),
    password: z.string().min(1, 'La contraseña es requerida.'),
})

interface LoginFormProps {
    onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const { handleLogin } = useLogin()
    const auth = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGoogleSubmitting, setGoogleIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            if (!auth)
                throw new Error('Servicio de autenticación no disponible')

            const loginData = {
                auth,
                email: values.email,
                password: values.password,
            }

            await handleLogin(loginData)

            toast({
                title: '¡Bienvenido de nuevo!',
                description: 'Has iniciado sesión correctamente.',
            })

            onSuccess?.()
            router.push('/')
        } catch (error: any) {
            console.error('Error signing in:', error)
            toast({
                variant: 'destructive',
                title: 'Error al iniciar sesión',
                description:
                    'Credenciales incorrectas o ha ocurrido un error. Por favor, inténtalo de nuevo.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleGoogleSignIn() {
        setGoogleIsSubmitting(true)
        try {
            if (!auth)
                throw new Error('Servicio de autenticación no disponible')
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(auth, provider)

            const idToken = await userCredential.user.getIdToken()
            console.log('Token de ID de Firebase (Google):', idToken)

            // Aquí podrías hacer la llamada a tu API con el token
            // await callApiWithToken(idToken)

            toast({
                title: '¡Bienvenido!',
                description: 'Has iniciado sesión con Google correctamente.',
            })

            onSuccess?.()
            router.push('/')
        } catch (error: any) {
            console.error('Error with Google sign in:', error)
            toast({
                variant: 'destructive',
                title: 'Error de Google',
                description:
                    'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
            })
        } finally {
            setGoogleIsSubmitting(false)
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">
                                    Correo Electrónico
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="nombre@ejemplo.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">
                                    Contraseña
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || isGoogleSubmitting}
                    >
                        {isSubmitting
                            ? 'Iniciando sesión...'
                            : 'Iniciar Sesión'}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        O continuar con
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting || isGoogleSubmitting}
            >
                {isGoogleSubmitting ? (
                    'Cargando...'
                ) : (
                    <>
                        <GoogleIcon className="mr-2 h-4 w-4" /> Google
                    </>
                )}
            </Button>
        </div>
    )
}
