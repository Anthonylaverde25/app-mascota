import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { authInterface } from './interface'

export class AuthRepository implements authInterface {
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
