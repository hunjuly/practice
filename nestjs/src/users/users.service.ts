import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'
import { UsersRepository } from './users.repository'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository, private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const exist = await this.repository.has({ email: dto.email })

        if (exist) throw new ConflictException()

        const candidate = new User()
        candidate.email = dto.email

        const user = await this.repository.add(candidate)

        await this.authService.add(user, dto.password)

        return user
    }

    async get(userId: string) {
        const user = await this.repository.find({ id: userId })

        if (user === undefined) throw new NotFoundException()

        return user
    }

    async remove(userId: string) {
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
