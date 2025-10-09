import { UserCredential } from 'firebase/auth'

export interface authInterface {
    login(credentials: CredentialLogin): Promise<{ session: UserCredential }>
    register(
        credentials: CredentialRegister
    ): Promise<{ session: UserCredential }>
}
