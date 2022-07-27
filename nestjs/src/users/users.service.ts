import { Injectable } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UsersRepository } from './users.repository'
import { Pagination, Assert, Expect } from 'src/common'
import {
    UpdateUserService,
    UpdateUserDto,
    UserQuery,
    RemoveUserService,
    CreateUserService,
    CreateUserDto
} from './domain'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const service = new CreateUserService(this.repository)

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
        const service = new RemoveUserService(this.repository)

        await service.exec(userId)

        await this.authService.remove(userId)

        return { id: userId }
    }

    async update(userId: string, dto: UpdateUserDto) {
        const service = new UpdateUserService(this.repository)

        const user = await service.exec(userId, dto)

        return user
    }
}
