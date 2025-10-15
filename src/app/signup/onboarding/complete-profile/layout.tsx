import { ReactNode } from 'react'

export default function layout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        Completa tu perfil
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Agrega los detalles finales para terminar de configurar
                        tu cuenta.
                    </p>
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 transition-colors"
                >
                    Guardar Cambios
                </button>
            </div>
            {children}
        </div>
    )
}
