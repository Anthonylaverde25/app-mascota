'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

const availableServices = [
    { id: 'veterinario', name: 'Veterinario' },
    { id: 'paseador', name: 'Paseador de Perros' },
    { id: 'peluquero', name: 'Peluquero Canino' },
    { id: 'cuidador', name: 'Cuidador a Domicilio' },
]

export default function ProfessionalRegistrationForm() {
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')
    const [globalAddressEnabled, setGlobalAddressEnabled] = useState(false)
    const [globalAddress, setGlobalAddress] = useState('')
    const [serviceData, setServiceData] = useState({})
    const [completedServices, setCompletedServices] = useState([])

    const handleDialogClose = (serviceId, data) => {
        setServiceData((prev) => ({ ...prev, [serviceId]: data }))
        if (!completedServices.includes(serviceId)) {
            setCompletedServices((prev) => [...prev, serviceId])
        }
    }

    const handleRemoveService = (serviceId) => {
        setCompletedServices((prev) => prev.filter((s) => s !== serviceId))
        setServiceData((prev) => {
            const newData = { ...prev }
            delete newData[serviceId]
            return newData
        })
    }

    return (
        <div className="flex h-screen w-full bg-gradient-to-r from-orange-50 to-yellow-50">
            {/* Formulario */}
            <div className="flex-1 flex flex-col p-6 gap-6 bg-white dark:bg-gray-950 overflow-auto">
                {/* Datos básicos */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ej: juanperez"
                            className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="ej: Juan Pérez"
                            className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Fecha de nacimiento / Inicio de operaciones
                        </label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-50"
                        />
                    </div>
                </div>

                {/* Dirección global refinada */}
                <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Dirección global
                            </label>
                            <span className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                Aplica a todos los servicios que no tengan
                                dirección específica.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setGlobalAddressEnabled(!globalAddressEnabled)
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                                globalAddressEnabled
                                    ? 'bg-blue-700'
                                    : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                                    globalAddressEnabled ? 'translate-x-6' : ''
                                }`}
                            />
                        </button>
                    </div>
                    {globalAddressEnabled && (
                        <input
                            type="text"
                            value={globalAddress}
                            onChange={(e) => setGlobalAddress(e.target.value)}
                            placeholder="Dirección principal"
                            className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-gray-50"
                        />
                    )}
                </div>

                {/* Servicios */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Servicios ofrecidos
                    </label>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {availableServices.map((service) => (
                            <Dialog key={service.id}>
                                <DialogTrigger asChild>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                                                completedServices.includes(
                                                    service.id
                                                )
                                                    ? 'bg-[oklch(0.637_0.237_25.331)] text-white hover:brightness-110'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {service.name}
                                        </button>
                                        {completedServices.includes(
                                            service.id
                                        ) && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveService(
                                                        service.id
                                                    )
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
                                        <DialogTitle>
                                            {service.name}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-2">
                                        {service.id === 'veterinario' && (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="Nº de Matrícula Profesional"
                                                    value={
                                                        serviceData[service.id]
                                                            ?.licenseNumber ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setServiceData(
                                                            (prev) => ({
                                                                ...prev,
                                                                [service.id]: {
                                                                    ...prev[
                                                                        service
                                                                            .id
                                                                    ],
                                                                    licenseNumber:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-50"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dirección específica (opcional)"
                                                    value={
                                                        serviceData[service.id]
                                                            ?.address || ''
                                                    }
                                                    onChange={(e) =>
                                                        setServiceData(
                                                            (prev) => ({
                                                                ...prev,
                                                                [service.id]: {
                                                                    ...prev[
                                                                        service
                                                                            .id
                                                                    ],
                                                                    address:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-50"
                                                />
                                            </>
                                        )}
                                        {service.id === 'paseador' && (
                                            <>
                                                <input
                                                    type="number"
                                                    placeholder="Años de experiencia"
                                                    value={
                                                        serviceData[service.id]
                                                            ?.experience || ''
                                                    }
                                                    onChange={(e) =>
                                                        setServiceData(
                                                            (prev) => ({
                                                                ...prev,
                                                                [service.id]: {
                                                                    ...prev[
                                                                        service
                                                                            .id
                                                                    ],
                                                                    experience:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-50"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Tarifa por hora (USD)"
                                                    value={
                                                        serviceData[service.id]
                                                            ?.hourlyRate || ''
                                                    }
                                                    onChange={(e) =>
                                                        setServiceData(
                                                            (prev) => ({
                                                                ...prev,
                                                                [service.id]: {
                                                                    ...prev[
                                                                        service
                                                                            .id
                                                                    ],
                                                                    hourlyRate:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-50"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dirección específica (opcional)"
                                                    value={
                                                        serviceData[service.id]
                                                            ?.address || ''
                                                    }
                                                    onChange={(e) =>
                                                        setServiceData(
                                                            (prev) => ({
                                                                ...prev,
                                                                [service.id]: {
                                                                    ...prev[
                                                                        service
                                                                            .id
                                                                    ],
                                                                    address:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        )
                                                    }
                                                    className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:text-gray-50"
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDialogClose(
                                                    service.id,
                                                    serviceData[service.id]
                                                )
                                            }
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-1/3 bg-gradient-to-b to-orange-200 flex flex-col items-center justify-start p-8 space-y-4 overflow-auto">
                <h3 className="text-xl font-bold text-gray-800">
                    Tips de Moderación
                </h3>
                <p className="text-sm text-gray-700">
                    Completa todos los campos relevantes para tu servicio.
                    Algunos campos adicionales aparecerán según los servicios
                    que selecciones.
                </p>
                <p className="text-sm text-gray-700">
                    Puedes definir una dirección global que se aplique a todos
                    tus servicios, o direcciones específicas por cada servicio.
                </p>
            </div>
        </div>
    )
}
