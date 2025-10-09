import { NextResponse, NextRequest } from 'next/server'

export async function apiCheck(req: NextRequest) {
    const API_BASE_URL = process.env.API_BASE_URL_PRIVATE
    if (!API_BASE_URL) {
        console.error('API_BASE_URL_PRIVATE is not defined')
        return new NextResponse('API url is not defined', { status: 500 })
    }

    try {
        const res = await fetch(`${API_BASE_URL}/health`)
        if (!res.ok)
            return new NextResponse('Service Unavailable', { status: 503 })
    } catch (error) {
        console.error('Error connecting to API:', error)
        return new NextResponse('Service Unavailable', { status: 503 })
    }

    return NextResponse.next()
}
