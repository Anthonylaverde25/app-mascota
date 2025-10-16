import useServices from '@/@features/service-types/hook/useServices'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ServicesType } from '@/types/services'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

export default function ServiceTabs() {
    const { setValue, getValues, watch, formState } = useFormContext()
    const { data: services_types = [] } = useServices()
    const [serviceData, setServiceData] = useState({})

    // watch devuelve el array de objetos seleccionados
    const selectedServices = watch('service_types') || []

    const handleDialogClose = (service: ServicesType) => {
        console.log('valido:', formState.isValid)
        console.log('erros:', formState.errors)
        console.log('form state', formState)

        const currentServices = getValues('service_types') || []
        if (!currentServices.some((s: ServicesType) => s.id === service.id)) {
            setValue('service_types', [
                ...currentServices,
                { id: service.id, code: service.code },
            ])
        }
    }

    const handleRemoveService = (serviceId: number) => {
        setValue(
            'service_types',
            getValues('service_types').filter(
                (s: ServicesType) => s.id !== serviceId
            )
        )

        setServiceData((prev) => {
            const copy = { ...prev }
            delete copy[serviceId]
            return copy
        })
    }

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
                                    {service.code === 'veterinarian' && (
                                        <input
                                            type="text"
                                            placeholder="Nº de Matrícula Profesional"
                                            value={
                                                watch(
                                                    `licenseNumbers.${service.id}`
                                                ) || ''
                                            }
                                            onChange={(e) =>
                                                setValue(
                                                    `licenseNumbers.${service.id}`,
                                                    e.target.value,
                                                    {
                                                        shouldValidate: true, // 👈 dispara la validación de Zod
                                                        shouldDirty: true,
                                                    }
                                                )
                                            }
                                        />
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
