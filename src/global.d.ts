// global.d.ts
export {} // Esto asegura que el archivo sea un módulo

declare global {
    interface AuthSession {
        uid: string
        displayName: string | null
        email: string
        accessToken: string
    }

    interface CredentialLogin {
        auth: any
        email: string
        password: string
    }

    interface CredentialRegister {
        auth: any
        email: string
        password: string
    }

    interface UserCredentialImpl {
        operationType: 'signIn' | 'signUp'
        authUser: AuthSession
    }

    type EntityType = 'service' | 'owner'

    interface RegisterFieldsEntity {
        name: string
        phone?: string
        dni?: string
        entityType: EntityType
    }
}
