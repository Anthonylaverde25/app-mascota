// app/middleware.ts
import { NextResponse, NextRequest } from 'next/server'
import { apiCheck } from './app/middleware/apiCheck'

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname

    // Aplico apiCheck solo a login y register
    if (path.startsWith('/login') || path.startsWith('/signup')) {
        const res = await apiCheck(req)
        if (res.status !== 200) return res
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/:path*'],
}
