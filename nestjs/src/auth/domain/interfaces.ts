import { Authentication } from './authentication.entity'

export type AuthQuery = {
    email?: string
    userId?: string
}

export interface IAuthRepository {
    create(candidate: Authentication): Promise<Authentication>
    findOne(query: AuthQuery): Promise<Authentication>
}
