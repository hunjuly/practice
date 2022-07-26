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

        const authDto = {
            userId: user.id,
            email: user.email,
            password: dto.password
        }

        const auth = await this.authService.create(authDto)
        // auth가 맞는지 여기서 확인해야 한다. 아니면 user 생성 실패로 해야 한다.
        return user
    }

    async get(userId: string) {
        const user = await this.repository.get(userId)

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }

    async findOne(query: UserQuery) {
        const user = await this.repository.findOne(query)

        if (!user) {
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

        await this.authService.remove(userId)
    }

    async update(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        if (!success) {
            throw new NotFoundException()
        }
    }
}
