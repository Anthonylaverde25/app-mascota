import { NextResponse, NextRequest } from 'next/server'

export async function apiCheck(req: NextRequest) {
    // Intentar obtener la URL de la API desde diferentes variables de entorno
    const API_BASE_URL =
        process.env.API_BASE_URL_PRIVATE ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'http://localhost:8000/api' // URL por defecto para desarrollo (Laravel API)


    try {
        const res = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Timeout de 5 segundos
            signal: AbortSignal.timeout(5000),
        })

        if (!res.ok) {
            console.warn(`API health check failed with status: ${res.status}`)
            // En desarrollo, permitir continuar aunque la API no esté disponible
            if (process.env.NODE_ENV === 'development') {
                console.warn(
                    'Development mode: allowing request to continue despite API unavailability'
                )
                return NextResponse.next()
            }
            return new NextResponse('Service Unavailable', { status: 503 })
        }

        console.log('API health check passed')
    } catch (error) {
        console.error('Error connecting to API:', error)

        // En desarrollo, permitir continuar aunque la API no esté disponible
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                'Development mode: allowing request to continue despite API connection error'
            )
            return NextResponse.next()
        }

        return new NextResponse('Service Unavailable', { status: 503 })
    }

    return NextResponse.next()
}
