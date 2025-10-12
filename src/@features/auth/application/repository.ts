import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth'
import { authInterface } from './interface'
import { mapUserFromApi } from '../auth.mapper'
import { AxiosInstance } from 'axios'

export class AuthRepository implements authInterface {
    /** Axios instance for API calls */
    constructor(private axiosInstance: AxiosInstance) {}

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

    async register(
        credential: CredentialRegister
    ): Promise<{ session: UserCredential }> {
        const { auth, email, password } = credential

        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )

            console.log('respuesta del register desde el repository', response)
            return { session: response }
        } catch (error) {
            throw error
        }
    }

    async currentUser(): Promise<{ authUser: AuthUser }> {
        try {
            const { data } = await this.axiosInstance.get('/auth/current-user')
            return { authUser: mapUserFromApi(data) }
        } catch (error) {
            throw error
        }
    }
}
