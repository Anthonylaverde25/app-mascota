'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import ServiceTabs from './components/ServiceTabs'

export default function ProfessionalRegistrationForm() {
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [dob, setDob] = useState('')

    const [globalAddressEnabled, setGlobalAddressEnabled] = useState(false)
    const [globalAddress, setGlobalAddress] = useState('')

    return (
        <div className="flex h-screen w-full bg-gradient-to-r from-orange-50 to-yellow-50">
            {/* Formulario */}
            <div className="flex-1 flex flex-col p-5 gap-6 bg-white dark:bg-gray-950 overflow-auto">
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

                {/* Dirección global */}
                <div className="space-y-3 p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Dirección global
                        </label>
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
                        <div className="flex flex-col gap-2 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-600">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                Esta dirección se aplicará a todos los servicios
                                que no tengan una dirección específica.
                            </span>
                            <input
                                type="text"
                                value={globalAddress}
                                onChange={(e) =>
                                    setGlobalAddress(e.target.value)
                                }
                                placeholder="Dirección principal"
                                className="w-full h-12 px-4 border rounded-lg border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-gray-50"
                            />
                        </div>
                    )}
                </div>

                <ServiceTabs />
            </div>

            {/* Sidebar */}
            <div className="w-1/3 bg-gradient-to-b to-orange-200 flex flex-col items-center justify-start p-6 space-y-4 overflow-auto">
                {/* Logo */}
                <div className="w-40 h-40 relative mb-4">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>

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

                {/* Preview dinámico */}
                <div className="w-full mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner border border-gray-300 dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Preview del perfil
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <div>
                            <strong>Usuario:</strong> {username || '-'}
                        </div>
                        <div>
                            <strong>Nombre completo:</strong> {fullName || '-'}
                        </div>
                        <div>
                            <strong>Fecha:</strong> {dob || '-'}
                        </div>

                        {globalAddressEnabled && (
                            <div className="mt-2">
                                <strong>Dirección global:</strong>{' '}
                                {globalAddress || '-'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
