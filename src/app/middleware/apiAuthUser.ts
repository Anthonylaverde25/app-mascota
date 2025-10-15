import { PROTECTED_PATHS } from '@/consts'
import { NextResponse, NextRequest } from 'next/server'

export async function apiAuthUser(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isProtected = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    )
    if (!isProtected) return NextResponse.next()

    // Obtener header Authorization
    const authHeader =
        req.headers.get('Authorization') || req.headers.get('authorization')

    if (!authHeader) {
        console.warn('⚠️ Middleware: token no recibido en headers')
        return NextResponse.redirect(new URL('/login', req.url))
    }

    console.log('Token recibido en middleware:', authHeader)

    // Extraer token si es tipo Bearer
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        console.log('Token extraído:', token)
    } else {
        console.warn('⚠️ Authorization header no tiene formato Bearer')
    }

    return NextResponse.next()
}
