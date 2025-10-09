import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth'
import { authInterface } from './interface'

export class AuthRepository implements authInterface {
    /**Login mediante Firebase */
    async login(
        credentials: CredentialLogin
    ): Promise<{ session: UserCredential }> {
        const { auth, email, password } = credentials

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            return { session: userCredential }
        } catch (error) {
            console.log('Error en login del repository', error)
            throw error
        }
    }

    /**Register mediante Firebase */
    async register(
        credential: CredentialRegister
    ): Promise<{ session: UserCredential }> {
        try {
            const { auth, email, password } = credential
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            console.log('responde del register desde el repository', response)

            return { session: response }
        } catch (error) {
            throw error
        }
    }
}
