import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'

@Injectable()
export class UsersService {
    constructor(private readonly authService: AuthService) {}

    async create(dto: CreateUserDto) {
        const user = await User.add(dto)

        await this.authService.createAccount(user, dto.password)

        return user
    }

    async get(userId: string) {
        const res = await User.findOne(userId)

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async count() {
        return User.count()
    }

    async findAll(page: Pagination) {
        const { items, total } = await User.findAll(page)

        return { ...page, items, total }
    }

    async findByEmail(email: string) {
        const user = await User.findByEmail(email)

        if (user === undefined) throw new NotFoundException()

        return user
    }

    async remove(userId: string) {
        const user = await this.get(userId)

        await this.authService.removeAccount(user)

        await user.remove()
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await User.update(userId, dto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
