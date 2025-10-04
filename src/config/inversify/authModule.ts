import { authInterface } from '@/@features/auth/application/interface'
import { AuthRepository } from '@/@features/auth/application/repository'
import { AuthRepositoryUseCase } from '@/@features/auth/use-case/authUseCase'
import { Container } from 'inversify'

export const configureAuthModule = (container: Container) => {
    container
        .bind<authInterface>(Symbol.for('authInterface'))
        .to(AuthRepository)

    container.bind<AuthRepositoryUseCase>(AuthRepositoryUseCase).toSelf()
}
