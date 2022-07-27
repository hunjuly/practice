import { Injectable } from '@nestjs/common'
import { AuthRepository } from './auth.repository'
import { AuthQuery, CreateAuthDto, CreateAuthService, ValidateService } from './domain'

@Injectable()
export class AuthService {
    constructor(private repository: AuthRepository) {}

    async create(dto: CreateAuthDto) {
        const service = new CreateAuthService(this.repository)

        const auth = await service.exec(dto)

        return auth
    }

    async remove(userId: string) {
        const success = await this.repository.remove(userId)

        Assert.truthy(success, `${userId} remove failed.`)
    }

    async validate(userId: string, password: string) {
        const service = new ValidateService(this.repository)

        const success = await service.exec(userId, password)

        return success
    }

    async findOne(query: AuthQuery) {
        const user = await this.repository.findOne(query)

        Expect.found(user)

        return user
    }
}
