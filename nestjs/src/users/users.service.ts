import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { UserCreatingService } from './domain/user.creating.service'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const service = new UserCreatingService(this.repository)

        const user = await service.create(dto)

        await this.authService.add(user.id, dto.password)

        return user
    }

    async findId(userId: string) {
        const user = await this.repository.findId(userId)

        if (user === undefined) {
            throw new NotFoundException()
        }

        return user
    }

    async findEmail(email: string) {
        const user = await this.repository.findEmail(email)

        if (user === undefined) {
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

        await this.authService.removeByUser(userId)
    }

    async update(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        if (!success) {
            throw new NotFoundException()
        }
    }
}
