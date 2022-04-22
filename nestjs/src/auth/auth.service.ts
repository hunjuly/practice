import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Authentication } from './entities/authentication.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    async createAccount(userId: string, password: string) {
        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.userId = userId
        auth.password = hashed

        await this.repository.save(auth)
    }

    async validateUser(userId: string, password: string) {
        const auth = await this.repository.findOne(userId)

        if (auth) {
            return await bcrypt.compare(password, auth.password)
        }

        return false
    }
}
