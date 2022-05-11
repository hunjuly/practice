import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Pagination } from 'src/common/pagination'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async create(email: string) {
        const res = await this.repository.findOne({ where: { email } })

        if (res) throw new ConflictException()

        const candidate = new User()
        candidate.email = email

        const user = await this.repository.save(candidate)

        return user
    }

    async get(userId: string) {
        const user = await this.repository.findOne(userId)

        if (user === undefined) throw new NotFoundException()

        return user
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

    async remove(user: User) {
        const res = await this.repository.delete(user.id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.repository.update(userId, dto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
