import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Authentication } from 'src/typeorm/entity/Authentication'
import { AuthRepository } from './auth.repository'

function getAuthId(userId: string) {
    return userId + '_local'
}

@Injectable()
export class AuthService {
    constructor(private repository: AuthRepository) {}

    async add(userId: string, password: string) {
        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.id = getAuthId(userId)
        auth.userId = userId
        auth.password = hashed

        await this.repository.add(auth)
    }

    async removeUser(userId: string) {
        const count = await this.repository.removeByUser(getAuthId(userId))

        if (count === 0) {
            throw new NotFoundException()
        }
    }

    async validate(userId: string, password: string) {
        const auth = await this.repository.get(getAuthId(userId))

        if (auth === undefined) {
            throw new NotFoundException({ message: 'user not found' }, 'ssss')
        }

        return bcrypt.compare(password, auth.password)
    }
}
