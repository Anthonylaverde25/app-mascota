// import { container } from '@/config/inversify/container'
// import { toast } from '@/hooks/use-toast'
// import { AuthRepositoryUseCase } from '../use-case/authUseCase'
// import { Auth, UserCredential } from 'firebase/auth'

// interface CredentialRegister {
//     auth: Auth
//     email: string
//     password: string
// }

// export default function useRegister() {
//     const authUseCase = container.get(AuthRepositoryUseCase)

//     const handleRegister = async (
//         credential: CredentialRegister
//     ): Promise<{ session: UserCredential }> => {
//         try {
//             const {
//                 auth: { session },
//             } = await authUseCase.register(credential)
//             // la idea seria enviar este responde hacia el backend, mi api, de esta manera registrar el usurio en user
//             // y asi establecemos Auth:user() que serie el usuario Activo o current user
//             console.log('respuesta desde firebase al regisrtar', session)
//             //  session esta compuesto por operationType y user
//             toast({
//                 title: '¡Cuenta creada!',
//                 description:
//                     'Tu cuenta ha sido creada exitosamente desde ek hook. Serás redirigido.',
//             })
//             return { session }
//         } catch (error) {
//             console.log('error al registrar desde el hook', error)
//             throw error
//         }
//     }

//     return { handleRegister }
// }

import { container } from '@/config/inversify/container'
import { toast } from '@/hooks/use-toast'
import { AuthRepositoryUseCase } from '../use-case/authUseCase'
import { Auth, UserCredential } from 'firebase/auth'

interface CredentialRegister {
    auth: Auth
    email: string
    password: string
}

export default function useRegister() {
    const authUseCase = container.get(AuthRepositoryUseCase)

    const handleRegister = async (
        credential: CredentialRegister
    ): Promise<UserCredential> => {
        try {
            // authUseCase.register debería devolver algo como { auth: { session: UserCredential } }
            const { session } = await authUseCase.register(credential)
            if (session) {
                const { operationType, user } = session
                if (operationType === 'signIn') {
                    const authToken = user.getIdToken() // queda como una promesa pendiente
                    console.log('token obtenido', authToken)

                    // entonces, si iniciamos session al registrarnos y tenemos el objecto user,
                    // debemos guardar ese objecto en la base de datos de nuestra api
                }
            }

            console.log('respuesta desde firebase al registrar', session)

            toast({
                title: '¡Cuenta creada!',
                description:
                    'Tu cuenta ha sido creada exitosamente desde el hook. Serás redirigido.',
            })

            // Devuelvo directamente el UserCredential de Firebase
            return session
        } catch (error) {
            console.error('error al registrar desde el hook', error)
            throw error
        }
    }

    return { handleRegister }
}
