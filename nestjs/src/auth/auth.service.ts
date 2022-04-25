import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Authentication } from './entities/authentication.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    async createAccount(user: User, password: string) {
        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.user = user
        auth.password = hashed

        await this.repository.save(auth)
    }

    async removeAccount(user: User) {
        const auth = await this.repository.findOne({ where: { user } })

        await this.repository.delete(auth.id)
    }

    async validateUser(user: User, password: string) {
        const auth = await this.repository.findOne({ where: { user } })

        if (auth) {
            return await bcrypt.compare(password, auth.password)
        }

        return false
    }
}
