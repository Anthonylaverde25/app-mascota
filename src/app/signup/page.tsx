'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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
import { useAuth, useUser } from '@/firebase'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/logo'
import useRegister from '@/@features/auth/hook/useRegister'
import axiosInstance from '@/lib/@axios'

// ==================== TYPES ====================

type EntityType = 'owner' | 'service'

type EntityTypeElement = {
    id: number
    code: EntityType
    description: string
}

interface EntityTypesResponse {
    entityTypes: EntityTypeElement[]
}

// ==================== SCHEMA ====================

const formSchema = z
    .object({
        name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
        email: z
            .string()
            .email('Por favor, introduce un correo electrónico válido.'),
        password: z
            .string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
        entityType: z.object({
            id: z.number(),
            code: z.enum(['owner', 'service']),
        }),
        phone: z.string().optional(),
        dni: z.string().optional(),
        address: z.string().optional(),
    })
    .refine(
        (data) =>
            data.entityType.code === 'service'
                ? data.dni && data.address
                : true,
        {
            message: 'DNI y Dirección son requeridos para servicios',
            path: ['dni'],
        }
    )

// ==================== ICON ====================

function GoogleIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
            {...props}
        >
            <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.45,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
        </svg>
    )
}

// ==================== COMPONENT ====================

export default function SignupPage() {
    const [entityTypes, setEntityTypes] = useState<EntityTypeElement[]>([])
    const { handleRegister } = useRegister()
    const { user, isUserLoading } = useUser()
    const auth = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGoogleSubmitting, setGoogleIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            entityType: {
                id: 1,
                code: 'owner',
            },
            phone: '',
            dni: '',
            address: '',
        },
    })

    const selectedEntity = form.watch('entityType')

    useEffect(() => {
        if (!isUserLoading && user) router.push('/')
    }, [user, isUserLoading, router])

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const {
                    data: { entityTypes },
                } = await axiosInstance.get<EntityTypesResponse>('entity-types')

                setEntityTypes(entityTypes)

                // Establecer el primer tipo como predeterminado
                if (entityTypes.length > 0) {
                    form.setValue('entityType', {
                        id: entityTypes[0].id,
                        code: entityTypes[0].code,
                    })
                }
            } catch (error) {
                console.error('Error al cargar tipos de entidad:', error)
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'No se pudieron cargar los tipos de usuario.',
                })
            }
        }

        fetchTypes()
    }, [form, toast])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            if (!auth)
                throw new Error('Servicio de autenticación no disponible')

            // Preparar los datos para enviar al backend
            const registrationData = {
                ...values,
                entityTypeId: values.entityType.id,
                entityTypeCode: values.entityType.code,
            }

            await handleRegister({ auth, ...registrationData })
            toast({
                title: '¡Cuenta creada!',
                description: 'Tu cuenta ha sido creada exitosamente.',
            })
            router.push('/')
        } catch (error: any) {
            let description =
                error.code === 'auth/email-already-in-use'
                    ? 'Este correo electrónico ya está en uso.'
                    : 'Ha ocurrido un error. Inténtalo de nuevo.'
            toast({
                variant: 'destructive',
                title: 'Error al registrarse',
                description,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleIsSubmitting(true)
        try {
            if (!auth)
                throw new Error('Servicio de autenticación no disponible')
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            toast({
                title: '¡Bienvenido!',
                description: 'Has iniciado sesión con Google correctamente.',
            })
            router.push('/')
        } catch {
            toast({
                variant: 'destructive',
                title: 'Error de Google',
                description: 'No se pudo iniciar sesión con Google.',
            })
        } finally {
            setGoogleIsSubmitting(false)
        }
    }

    if (isUserLoading || user)
        return (
            <div className="flex justify-center items-center h-screen">
                Cargando...
            </div>
        )

    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full sm:w-[400px] space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <Logo className="mx-auto h-8 w-8" />
                    <h1 className="text-2xl font-semibold tracking-tight font-headline">
                        Crea una cuenta1
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Introduce tus datos para crear tu cuenta
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre completo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tu nombre completo"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ENTITY TYPE CARDS */}
                        <FormField
                            control={form.control}
                            name="entityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de usuario</FormLabel>

                                    <div className="flex gap-4 mt-2">
                                        {entityTypes?.map((type) => {
                                            const isSelected =
                                                field.value?.id === type.id

                                            return (
                                                <div
                                                    key={type.id}
                                                    onClick={() =>
                                                        field.onChange({
                                                            id: type.id,
                                                            code: type.code,
                                                        })
                                                    }
                                                    className={`flex-1 cursor-pointer rounded-xl p-2.5 text-center transition-all duration-200 border ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/10 shadow-md'
                                                            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                                                    }`}
                                                >
                                                    <p className="text-sm font-medium">
                                                        {type.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {type.code}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* EMAIL */}
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

                        {/* PASSWORD */}
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

                        {/* PHONE */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono (opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="+54 9 11 1234 5678"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DNI y DIRECCIÓN solo para SERVICE */}
                        {selectedEntity?.code === 'service' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="dni"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DNI</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="DNI"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Dirección completa"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* SUBMIT BUTTON */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || isGoogleSubmitting}
                        >
                            {isSubmitting
                                ? 'Creando cuenta...'
                                : 'Crear Cuenta'}
                        </Button>
                    </form>
                </Form>

                {/* OR DIVIDER */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            O continuar con
                        </span>
                    </div>
                </div>

                {/* GOOGLE SIGNIN */}
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting || isGoogleSubmitting}
                    className="w-full"
                >
                    {isGoogleSubmitting ? (
                        'Cargando...'
                    ) : (
                        <>
                            <GoogleIcon className="mr-2 h-4 w-4" /> Google
                        </>
                    )}
                </Button>

                {/* LOGIN LINK */}
                <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        href="/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}
