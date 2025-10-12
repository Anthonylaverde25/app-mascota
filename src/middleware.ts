// app/middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { apiCheck } from './app/middleware/apiCheck'

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    // En desarrollo, hacer el apiCheck opcional
    if (path.startsWith('/login') || path.startsWith('/signup')) {
        // Solo hacer el check si no estamos en desarrollo o si la API está configurada
        const shouldCheckApi =
            process.env.NODE_ENV !== 'development' ||
            process.env.API_BASE_URL_PRIVATE ||
            process.env.NEXT_PUBLIC_API_BASE_URL

        if (shouldCheckApi) {
            const res = await apiCheck(req)
            if (res.status !== 200) return res
        } else {
            console.warn('Development mode: Skipping API check for auth pages')
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/:path*'],
}
