import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { UserCreatingService } from './domain/user.creating.service'
import { UserQuery } from './domain/interfaces'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const service = new UserCreatingService(this.repository)

        const user = await service.create(dto)

        await this.authService.add(user.id, dto.password)

        return user
    }

    async get(userId: string) {
        const user = await this.repository.get(userId)

        if (user === null) {
            throw new NotFoundException()
        }

        return user
    }

    async findOne(query: UserQuery) {
        const user = await this.repository.findOne(query)

        if (user === null) {
            throw new NotFoundException()
        }

        return user
    }

    async findAll(page: Pagination) {
        return this.repository.findAll(page)
    }

    async remove(userId: string) {
        const success = await this.repository.remove(userId)

        if (!success) {
            throw new NotFoundException()
        }

        await this.authService.removeUser(userId)
    }

    async update(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        if (!success) {
            throw new NotFoundException()
        }
    }
}
