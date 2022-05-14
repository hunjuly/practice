import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pagination } from 'src/common/pagination'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './domain/user.entity'
import { IUsersRepository } from './domain/interfaces'

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async findEmail(email: string) {
        return this.repository.findOne({ where: { email } })
    }

    async create(candidate: User) {
        const newUser = await this.repository.save(candidate)

        return newUser
    }

    async findId(userId: string) {
        return this.repository.findOne(userId)
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

    async remove(userId: string) {
        const res = await this.repository.delete(userId)

        return res.affected === 1
    }

    async update(userId: string, dto: UpdateUserDto) {
        const res = await this.repository.update(userId, dto)

        return res.affected === 1
    }
}
