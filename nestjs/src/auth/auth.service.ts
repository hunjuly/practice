import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Authentication } from './entities/authentication.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

/* user? userId?
user 측면
user의 인증을 관리하는 것. 의미적으로는 이게 맞다.
나중에 user의 무엇이 필요할지 모른다.

userId 측면
MSA에서 user 전체를 던지지는 않는다.
꼭 필요한 정보만 -> 의존성 최소화
user 정보가 필요하면 usersService에 쿼리하면 된다.
usersService가 아닌 다른 서비스에서 삭제 할 수 있다.
*/
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>
    ) {}

    // 여기서는 user를 받는게 맞다. 생성할 때 user를 참조한다.
    async add(user: User, password: string) {
        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.user = user
        auth.password = hashed

        await this.repository.save(auth)
    }

    async remove(userId: string) {
        await this.repository.removeByUser(user)
    }

    async validate(userId: string, password: string) {
        const auth = await this.repository.findByUser({ where: { user } })

        if (auth) {
            return await bcrypt.compare(password, auth.password)
        }

        return false
    }
}
