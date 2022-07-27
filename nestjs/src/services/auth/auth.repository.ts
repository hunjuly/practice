import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Authentication } from './domain/authentication.entity'
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

    async remove(userId: string) {
        const res = await this.repository.delete(userId)

        return res.affected
    }

    async get(userId: string) {
        const user = await this.repository.findOneBy({ userId })

        return user
    }

    async findOne(where: AuthQuery) {
        const auth = await this.repository.findOne({ where })

        return auth
    }
}
