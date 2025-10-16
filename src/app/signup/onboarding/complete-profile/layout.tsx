// 'use client'

// import { ReactNode } from 'react'
// import { useAxiosInstance } from '@/lib/@axios'
// import { FormProvider, useForm } from 'react-hook-form'

// interface LayoutProps {
//     children: ReactNode
// }

// export default function Layout({ children }: LayoutProps) {
//     const axiosInstance = useAxiosInstance()

//     const methods = useForm({
//         defaultValues: {
//             service_types: [] as { id: number; code: string }[],
//             licenseNumbers: {} as Record<number, string>,
//         },
//     })

//     // Datos estáticos simulando un formulario
//     const formData = {
//         description:
//             'Soy un profesional con experiencia en cuidado de mascotas',
//         // social_link: 'https://mi-perfil.com',
//         service_types_ids: [1, 2], // IDs de servicios seleccionados
//     }

//     const handleSave = async () => {
//         try {
//             const values = methods.getValues()
//             console.log('valores para crear', values)
//             // const response = await axiosInstance.post(
//             //     'profile',
//             //     { profile_data: formData }, // enviamos bajo profile_data
//             //     {
//             //         headers: {
//             //             Authorization: `Bearer ${token}`,
//             //         },
//             //     }
//             // )
//             // console.log('Perfil guardado:', response.data)
//         } catch (err) {
//             console.error('Error al guardar perfil', err)
//         }
//     }

//     return (
//         <FormProvider {...methods}>
//             <div className="w-full">
//                 <div className="flex items-center justify-between p-6 border-b border-border">
//                     <div>
//                         <h1 className="text-2xl font-bold text-foreground">
//                             Completa tu perfil
//                         </h1>
//                         <p className="mt-1 text-sm text-muted-foreground">
//                             Agrega los detalles finales para terminar de
//                             configurar tu cuenta.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handleSave}
//                         className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
//                     >
//                         Guardar Cambios
//                     </button>
//                 </div>

//                 {children}
//             </div>
//         </FormProvider>
//     )
// }

'use client'

import { ReactNode } from 'react'
import { useAxiosInstance } from '@/lib/@axios'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ServicesType } from '@/types/services'

interface LayoutProps {
    children: ReactNode
}

// 1️⃣ Schema de validación
const profileSchema = z.object({
    service_types: z.array(
        z.object({
            id: z.number(),
            code: z.string(),
        })
    ),
    licenseNumbers: z.record(z.string()).refine(
        (data, ctx) => {
            const services = ctx.parent.service_types
            const vet = services.find(
                (s: ServicesType) => s.code === 'veterinario'
            )
            if (vet) {
                // convertir vet.id a string porque keys de z.record son strings
                return Boolean(data[vet.id.toString()])
            }
            return true
        },
        { message: 'Número de matrícula obligatorio para veterinario' }
    ),
    description: z.string().optional(),
})

export default function Layout({ children }: LayoutProps) {
    const axiosInstance = useAxiosInstance()

    // 2️⃣ Inicialización de useForm con schema
    const methods = useForm({
        defaultValues: {
            service_types: [] as { id: number; code: string }[],
            licenseNumbers: {} as Record<number, string>,
            description: '',
        },
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
