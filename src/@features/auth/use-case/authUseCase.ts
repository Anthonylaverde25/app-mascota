import { inject, injectable } from 'inversify'
import type { authInterface } from '../application/interface'
import { toast } from '@/hooks/use-toast'
import { Auth } from 'firebase/auth'

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

    async register(credential: CredentialRegister): Promise<{ auth: any }> {
        try {
            const response = await this.repository.register(
                credential
            )

            return { auth: response }
        } catch (error) {
            console.log('error al registrar desde el hook')
            throw error
        }
    }
}
