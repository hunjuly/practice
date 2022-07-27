import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './domain/dto/create-user.dto'
import { UpdateUserDto } from './domain/dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { UserQuery } from './domain/interfaces'
import { Assert, Expect } from 'src/common'
import { UserUpdatingService } from './domain/user-updating.service'
import { UserRemovingService } from './domain/user-removing.service'
import { UserCreatingService } from './domain/user-creating.service'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const service = new UserCreatingService(this.repository)

        const user = await service.exec(dto)

        const authDto = {
            userId: user.id,
            email: user.email,
            password: dto.password
        }

        const auth = await this.authService.create(authDto)

        Assert.truthy(auth.userId === user.id, `${auth.userId}, ${user.id} not equals.`)

        return user
    }

    async get(userId: string) {
        const user = await this.repository.get(userId)

        Expect.found(user)

        return user
    }

    async findOne(query: UserQuery) {
        const user = await this.repository.findOne(query)

        Expect.found(user)

        return user
    }

    async findAll(page: Pagination) {
        return this.repository.findAll(page)
    }

    async remove(userId: string) {
        const service = new UserRemovingService(this.repository)

        await service.exec(userId)

        await this.authService.remove(userId)

        return { id: userId }
    }

    async update(userId: string, dto: UpdateUserDto) {
        const service = new UserUpdatingService(this.repository)

        const user = await service.exec(userId, dto)

        return user
    }
}
