import { CreateUserDto } from '../dto/create-user.dto'
import { User } from './user.entity'
import { AlreadyExistsException } from './exceptions'
import { IUsersRepository } from './interfaces'

export class UserCreatingService {
    constructor(private readonly repo: IUsersRepository) {}

    async create(dto: CreateUserDto) {
        const user = await this.repo.findEmail(dto.email)

        if (user) throw new AlreadyExistsException()

        const candidate = new User()
        candidate.email = dto.email

        const newUser = await this.repo.create(candidate)

        return newUser
    }
}
