import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pagination } from 'src/common/pagination'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

type Query = {
    id?: string
    email?: string
}

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async has(query: Query) {
        return undefined !== (await this.repository.findOne({ where: query }))
    }

    async find(query: Query) {
        return this.repository.findOne({ where: query })
    }

    async findPage(page: Pagination, query?: Query) {
        const [items, total] = await this.repository.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: {
                id: 'DESC'
            },
            where: query
        })

        return { ...page, items, total }
    }

    // async hasEmail(email: string) {
    //     return undefined !== (await this.repository.findOne({ where: { email } }))
    // }

    // async findByEmail(email: string) {
    //     return this.repository.findOne({ where: { email } })
    // }

    // async findById(userId: string) {
    //     return this.repository.findOne(userId)
    // }

    async add(candidate: User) {
        const user = await this.repository.save(candidate)

        return user
    }

    async remove(userId: string) {
        const res = await this.repository.delete(userId)

        if (res.affected !== 1) throw new NotFoundException()
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.repository.update(userId, dto)

        if (res.affected !== 1) throw new NotFoundException()
    }
}
