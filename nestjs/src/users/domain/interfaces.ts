import { User } from '../entities/User'

export type UserQuery = {
    email?: string
}

export interface IUsersRepository {
    create(candidate: User): Promise<User>
    findOne(query: UserQuery): Promise<User>
}
