'use client'

import useServices from '@/@features/service-types/hook/useServices'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ServicesType } from '@/types/services'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { profileSchema } from '@/schemas/profileSchema' // 👈 ya lo tienes
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

// ✅ Inferimos automáticamente el tipo de los valores del formulario
type ProfileFormValues = z.infer<typeof profileSchema>

export default function ServiceTabs() {
    const {
        setValue,
        getValues,
        watch,
        formState: { errors, isValid },
        trigger,
        register,
    } = useFormContext<ProfileFormValues>() // 👈 Tipado fuerte del contexto

    const { data: services_types = [] } = useServices()

    const selectedServices = watch('service_types') || []

    // ➕ Agregar un servicio seleccionado
    const handleDialogClose = (service: ServicesType) => {
        const currentServices = getValues('service_types') || []
        if (!currentServices.some((s: ServicesType) => s.id === service.id)) {
            setValue('service_types', [
                ...currentServices,
                { id: service.id, code: service.code },
            ])
        }
        trigger() // Revalida después de agregar
    }

    // ➖ Eliminar un servicio seleccionado
    const handleRemoveService = (serviceId: number) => {
        setValue(
            'service_types',
            getValues('service_types').filter(
                (s: ServicesType) => s.id !== serviceId
            )
        )
        trigger() // Revalida después de eliminar
    }

    useEffect(() => {
        console.log('formulario valido?:', isValid)
        console.log('errores del formulario:', errors)
    }, [getValues()])

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Servicios ofrecidos
            </label>

            <div className="flex flex-wrap gap-3 mt-2">
                {services_types.map((service: ServicesType) => {
                    const isSelected = selectedServices.some(
                        (s: any) => s.id === service.id
                    )
                    const serviceIndex = selectedServices.findIndex(
                        (s: any) => s.id === service.id
                    )

                    return (
                        <Dialog key={service.id}>
                            <DialogTrigger asChild>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'bg-blue-600 text-white hover:brightness-110'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {service.name}
                                    </button>

                                    {isSelected && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveService(service.id)
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                            title="Eliminar servicio"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>{service.name}</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4 mt-2">
                                    {/* Si el servicio es veterinario, mostramos el campo */}
                                    {service.code === 'veterinarian' && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Número de matrícula
                                            </label>
                                            <input
                                                type="text"
                                                {...register(
                                                    `service_types.${serviceIndex}.license_number` as const
                                                )}
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                                                placeholder="Ej: MV-12345"
                                            />

                                            {serviceIndex > -1 &&
                                                errors.service_types?.[
                                                    serviceIndex
                                                ]?.license_number && (
                                                    <p className="text-red-600 text-sm mt-1">
                                                        {
                                                            (
                                                                errors
                                                                    .service_types?.[
                                                                    serviceIndex
                                                                ]
                                                                    ?.license_number as {
                                                                    message?: string
                                                                }
                                                            )?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDialogClose(service)
                                        }
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )
                })}
            </div>
        </div>
    )
}
