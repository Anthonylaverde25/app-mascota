// app/middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { apiCheck } from './app/middleware/apiCheck'
import { apiAuthUser } from './app/middleware/apiAuthUser'
import { PUBLIC_PATHS } from './consts'

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
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

        // Para rutas públicas NO chequeamos token
        return NextResponse.next()
    }

    // Solo rutas protegidas pasan por apiAuthUser
    const authRes = await apiAuthUser(req)
    if (authRes) {
        // Si apiAuthUser retorna una redirección u otro NextResponse
        return authRes
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/api/:path*',
    ],
}
