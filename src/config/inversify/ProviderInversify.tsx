'use client' // Muy importante en Next.js App Router

import React, { createContext, useContext } from 'react'
import { Container } from 'inversify'
import { container } from '@/config/inversify/container' // Importar el contenedor

// Creamos el contexto que va a guardar el contenedor
const InversifyContext = createContext<Container | null>(null)

// Provider que envolverá tu app
export const ProviderInversify = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <InversifyContext.Provider value={container}>
            {children}
        </InversifyContext.Provider>
    )
}

// Hook para inyectar dependencias desde cualquier componente
export const useInjection = <T,>(identifier: symbol): T => {
    const container = useContext(InversifyContext)
    if (!container) {
        throw new Error(
            'No Inversify container found. Did you forget to wrap your app with ProviderInversify?'
        )
    }
    return container.get<T>(identifier)
}
