import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Authentication } from './domain/authentication.entity'

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    async add(auth: Authentication) {
        return this.repository.save(auth)
    }

    async removeByUser(authId: string) {
        const res = await this.repository.delete(authId)

        return res.affected
    }

    async get(authId: string) {
        const user = await this.repository.findOneBy({ id: authId })

        return user
    }
}
