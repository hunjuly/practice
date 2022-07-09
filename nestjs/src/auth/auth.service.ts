import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Authentication } from './domain/auth.entity'
import { AuthRepository } from './auth.repository'

/* user? userId?
user 측면
user의 인증을 관리하는 것. 의미적으로는 이게 맞다.
나중에 user의 무엇이 필요할지 모른다.

userId 측면
MSA에서 user 전체를 던지지는 않는다.
꼭 필요한 정보만 -> 의존성 최소화
user 정보가 필요하면 usersService에 쿼리하면 된다.
usersService가 아닌 다른 서비스에서 삭제 할 수 있다.
auth는 user aggregate에 포함하지 않는다.
*/
@Injectable()
export class AuthService {
    constructor(private repository: AuthRepository) {}

    async add(userId: string, password: string) {
        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.id = userId + '_local'
        auth.userId = userId
        auth.password = hashed

        await this.repository.add(auth)
    }

    async removeByUser(userId: string) {
        const count = await this.repository.removeByUser(userId + '_local')

        if (count === 0) {
            throw new NotFoundException()
        }
    }

    async validate(userId: string, password: string) {
        const auth = await this.repository.get(userId + '_local')

        if (auth === undefined) {
            throw new NotFoundException()
        }

        return bcrypt.compare(password, auth.password)
    }
}
