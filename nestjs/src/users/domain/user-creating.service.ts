import { CreateUserDto } from './dto/create-user.dto'
import { User } from '../entities/user.entity'
import { AlreadyExistsException } from './exceptions'
import { IUsersRepository } from './interfaces'

export class UserCreatingService {
    constructor(private readonly repository: IUsersRepository) {}

    async exec(dto: CreateUserDto) {
        const user = await this.repository.findOne({ email: dto.email })

        if (user) throw new AlreadyExistsException()

        const candidate = new User()
        candidate.email = dto.email

        const newUser = await this.repository.create(candidate)

        return newUser
    }
}
