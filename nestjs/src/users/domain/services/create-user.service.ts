import { IsEmail, IsNotEmpty } from 'class-validator'
import { User } from '../entities'
import { AlreadyExistsException } from '../exceptions'
import { IUsersRepository } from '../interfaces'

export class CreateUserDto {
    /**
     * email 형식을 지켜야 한다.
     * @example user@mail.com
     */
    @IsEmail()
    email: string

    /**
     * 빈 문자열은 허용하지 않는다.
     */
    @IsNotEmpty()
    password: string
}

export class CreateUserService {
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
