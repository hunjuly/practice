import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const user = await this.repository.create(dto.email)

        await this.authService.createAccount(user, dto.password)

        return user
    }

    async get(userId: string) {
        return this.repository.get(userId)
    }

    async count() {
        return this.repository.count()
    }

    async findAll(page: Pagination) {
        return this.repository.findAll(page)
    }

    async findByEmail(email: string) {
        return this.repository.findByEmail(email)
    }

    async remove(userId: string) {
        const user = await this.repository.get(userId)

        await this.authService.removeAccount(user)

        await this.repository.remove(user)
    }

    async update(userId: string, dto: UpdateUserDto) {
        await this.repository.update(userId, dto)
    }
}
