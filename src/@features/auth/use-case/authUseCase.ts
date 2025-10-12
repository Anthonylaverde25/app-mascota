import { injectable } from 'inversify'
import type { AxiosInstance } from 'axios'
import { Auth, UserCredential } from 'firebase/auth'
import { AuthRepository } from '../application/repository'

@injectable()
export class AuthRepositoryUseCase {
    private repository: AuthRepository

    constructor(axiosInstance: AxiosInstance) {
        this.repository = new AuthRepository(axiosInstance)
    }

    async login(
        credentials: CredentialLogin
    ): Promise<{ session: UserCredential }> {
        try {
            return await this.repository.login(credentials)
        } catch (error) {
            console.log('Error al hacer login desde el caso de uso')
            throw error
        }
    }

    async register(
        credential: CredentialRegister
    ): Promise<{ session: UserCredential }> {
        try {
            return await this.repository.register(credential)
        } catch (error) {
            console.log('Error al registrar desde el caso de uso')
            throw error
        }
    }

    async currentUser(): Promise<{ authUser: AuthUser }> {
        try {
            return await this.repository.currentUser()
        } catch (error) {
            throw error
        }
    }
}
