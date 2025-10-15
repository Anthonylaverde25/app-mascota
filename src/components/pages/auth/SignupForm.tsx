'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
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
import useRegister from '@/@features/auth/hook/useRegister'
import { useAxiosInstance } from '@/lib/@axios'
import { GoogleIcon } from './GoogleIcon'
import { EntityTypeSelector } from './EntityTypeSelector'

// Types
type EntityType = 'owner' | 'service'

type EntityTypeElement = {
    id: number
    code: EntityType
    description: string
}

interface EntityTypesResponse {
    entityTypes: EntityTypeElement[]
}

// Schema
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

interface SignupFormProps {
    onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
    const axiosInstance = useAxiosInstance()
    const [entityTypes, setEntityTypes] = useState<EntityTypeElement[]>([])
    const { handleRegister } = useRegister()
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
        const fetchTypes = async () => {
            try {
                const {
                    data: { entityTypes },
                } = await axiosInstance.get<EntityTypesResponse>(
                    '/entity-types'
                )

                console.log('tipos desde el registrar', entityTypes)

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
    }, [form, toast, axiosInstance])

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

            onSuccess?.()
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

            onSuccess?.()
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

    return (
        <div className="mx-auto w-full sm:w-[400px] space-y-6">
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

                    {/* ENTITY TYPE SELECTOR */}
                    <EntityTypeSelector form={form} entityTypes={entityTypes} />

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
                        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
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
        </div>
    )
}
