import { UsersRepository } from './users.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'

export class AlreadyExistsUserException extends Error {
    // constructor(response: string | Record<string, any>, status: number) {
    //     super()
    // }
}

export class CreateUserService {
    // UsersRepository 직접 받지 말아라. IUsersRepository가 필요하다
    constructor(private readonly repository: UsersRepository) {}

    async createUser(dto: CreateUserDto) {
        const exist = await this.repository.has({ email: dto.email })

        if (exist) throw new AlreadyExistsUserException()

        const candidate = new User()
        candidate.email = dto.email

        const user = await this.repository.add(candidate)

        return user
    }
}
