import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { UserCreatingService } from './domain/user.creating.service'
import { UserQuery } from './domain/interfaces'
import { Assert, Expect } from 'src/common'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const service = new UserCreatingService(this.repository)

        const user = await service.create(dto)

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
        // TODO 이것도 domain service로 분리
        const user = await this.repository.get(userId)

        Expect.found(user)

        const success = await this.repository.remove(userId)

        Assert.truthy(success, `${userId} remove failed.`)

        await this.authService.remove(userId)

        return { id: userId, status: 'removed' }
    }

    async update(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        Expect.found(success)

        const user = await this.repository.get(userId)

        Assert.truthy(user, `${userId} get failed.`)

        return user
    }
}
