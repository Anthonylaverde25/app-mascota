import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
        // Imprimir headers completos
        // console.log('Headers:', Object.fromEntries(req.headers.entries()))
        const headers = Object.fromEntries(req.headers.entries())

        // Obtener Authorization
        const authHeader = req.headers.get('Authorization')
        // console.log('Authorization header:', authHeader)

        // Leer el body enviado desde Axios
        const body = await req.json()
        // console.log('Body recibido:', body)

        return NextResponse.json({ ok: true, received: body })
    } catch (error) {
        // console.error('Error leyendo request:', error)
        return NextResponse.json(
            { ok: false, error: error.message },
            { status: 500 }
        )
    }
}
