import { Container } from 'inversify'
import { configureAuthModule } from './authModule'

export const container = new Container()
configureAuthModule(container)
