import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { User } from './entities/user.entity'
import { CreateUserService } from './create.user.service'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        try {
            const service = new CreateUserService(this.repository)

            const user = await service.createUser(dto)

            // user의 id만 넘겨준다. 관계를 끊어라
            // user aggregate root에 auth는 포함되지 않는다.
            await this.authService.add(user, dto.password)

            return user
        } catch (error) {
            // AlreadyExistsUser를 어떻게 catch하는가?
            throw new ConflictException()
        }
    }

    async get(userId: string) {
        const user = await this.repository.find({ id: userId })

        if (user === undefined) throw new NotFoundException()

        return user
    }

    async remove(userId: string) {
        // find 말고 has 사용한다.
        const user = await this.repository.find({ id: userId })

        if (user === undefined) throw new NotFoundException()

        await this.authService.remove(user.id)

        await this.repository.remove(user.id)
    }

    async findAll(page: Pagination) {
        return this.repository.findPage(page)
    }

    async findByEmail(email: string) {
        const user = await this.repository.find({ email })

        if (user === undefined) throw new NotFoundException()

        return user
    }

    async update(userId: string, dto: UpdateUserDto) {
        await this.repository.update(userId, dto)
    }
}
