import { User } from './user.entity'

export interface IUsersRepository {
    create(candidate: User): Promise<User>
    findEmail(email: string): Promise<User>
}
