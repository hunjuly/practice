import { Authentication } from '../entities/Authentication'

export type AuthQuery = {
    email?: string
}

export interface IAuthRepository {
    create(candidate: Authentication): Promise<Authentication>
    findOne(query: AuthQuery): Promise<Authentication>
}
