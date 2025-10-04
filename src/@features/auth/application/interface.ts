import { UserCredential } from "firebase/auth";

export interface authInterface {
    register(
        credentials: CredentialRegister
    ): Promise<{ session: UserCredential }>
}
