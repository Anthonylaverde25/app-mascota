import { inject, injectable } from 'inversify'
import type { authInterface } from '../application/interface'
import { toast } from '@/hooks/use-toast'
import { Auth, UserCredential } from 'firebase/auth'

@injectable()

interface CredentialRegister {
    auth: Auth
    email: string
    password: string
}

export class AuthRepositoryUseCase {
    constructor(
        @inject(Symbol.for('authInterface'))
        private readonly repository: authInterface
    ) {}


    async login(credentials: CredentialLogin): Promise<{ session: UserCredential }> {
        try {
            const {session} = await this.repository.login(credentials)
            return { session}
        } catch (error) {
            console.log('error al hacer login desde el caso de uso')
            throw error
        }
    }

    async register(credential: CredentialRegister): Promise<{ session: UserCredential }> {
        try {
            const {session} = await this.repository.register(
                credential
            )

            return { session}
        } catch (error) {
            console.log('error al registrar desde el hook')
            throw error
        }
    }
}
