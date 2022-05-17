import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pagination } from 'src/common/pagination'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './domain/user.entity'
import { IUsersRepository, UserQuery } from './domain/interfaces'

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async get(userId: string) {
        return this.repository.findOne(userId)
    }

    async findOne(where: UserQuery) {
        return this.repository.findOne({ where })
    }

    async findAll(page: Pagination) {
        const [items, total] = await this.repository.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: {
                id: 'DESC'
            }
        })

        return { ...page, total, items }
    }

    async create(candidate: User) {
        const newUser = await this.repository.save(candidate)

        return newUser
    }

    async remove(userId: string) {
        const res = await this.repository.delete(userId)

        return res.affected === 1
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.repository.update(userId, dto)

        return res.affected === 1
    }
}
