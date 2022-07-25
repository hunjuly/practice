import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Authentication } from './entities/Authentication'
import { AuthQuery, IAuthRepository } from './domain/interfaces'

@Injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    async create(auth: Authentication) {
        return this.repository.save(auth)
    }

    async remove(authId: string) {
        const res = await this.repository.delete(authId)

        return res.affected
    }

    async get(userId: string) {
        const user = await this.repository.findOneBy({ userId })

        return user
    }

    async findOne(where: AuthQuery) {
        return this.repository.findOne({ where })
    }
}
