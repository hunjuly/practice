import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { AuthService } from 'src/auth/auth.service'
import { Pagination } from 'src/common/pagination'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        private readonly authService: AuthService
    ) {}

    async create(createUserDto: CreateUserDto) {
        const res = await this.repository.findOne({ where: { email: createUserDto.email } })

        if (res) throw new ConflictException()

        const value = new User()
        value.email = createUserDto.email

        const user = await this.repository.save(value)

        await this.authService.createAccount(user, createUserDto.password)

        return user
    }

    async get(userId: string) {
        const res = await this.repository.findOne(userId)

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async count() {
        return this.repository.count()
    }

    async findAll(page: Pagination) {
        const [items, total] = await this.repository.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: {
                id: 'DESC'
            }
        })

        return { ...page, items, total }
    }

    async findByEmail(email: string) {
        const res = await this.repository.findOne({ where: { email } })

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async remove(userId: string) {
        const user = await this.get(userId)

        await this.authService.removeAccount(user)

        const res = await this.repository.delete(user.id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(userId: string, updateUserDto: UpdateUserDto) {
        const res = await this.repository.update(userId, updateUserDto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
