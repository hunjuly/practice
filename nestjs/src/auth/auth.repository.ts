import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pagination } from 'src/common/pagination'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    async add(auth: Authentication) {
        return this.repository.save(auth)
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

    async findByUser(email: string) {
        const res = await this.repository.findOne({ where: { email } })

        if (res === undefined) throw new NotFoundException()

        return res
    }

    async removeByUser(user: User) {
        const auth = await this.repository.findByUser({ where: { user } })

        const res = await this.repository.delete(user.id)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.repository.update(userId, dto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
