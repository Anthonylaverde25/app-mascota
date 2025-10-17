'use client'

import { ReactNode } from 'react'
import { useAxiosInstance } from '@/lib/@axios'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/schemas/profileSchema'
import { profileDefaultValues } from '@/default-values'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const axiosInstance = useAxiosInstance()

    const methods = useForm({
        defaultValues: profileDefaultValues,
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
    })

    console.log('formulario', methods.watch())

    const handleSave = async () => {
        try {
            const values = methods.getValues()
            console.log('valores para crear', values)

            // Ejemplo de envío de datos
            // const token = 'YOUR_FIREBASE_ID_TOKEN'
            // const response = await axiosInstance.post(
            //     'profile',
            //     { profile_data: values },
            //     { headers: { Authorization: `Bearer ${token}` } }
            // )
            // console.log('Perfil guardado:', response.data)
        } catch (err) {
            console.error('Error al guardar perfil', err)
        }
    }

    console.log('¿Formulario válido?:', methods.formState.isValid)
    console.log('Errores:', methods.formState.errors)

    return (
        <FormProvider {...methods}>
            <div className="w-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Completa tu perfil
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Agrega los detalles finales para terminar de
                            configurar tu cuenta.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Guardar Cambios
                    </button>
                </div>

                {children}
            </div>
        </FormProvider>
    )
}
