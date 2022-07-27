import * as bcrypt from 'bcrypt'
import { Authentication } from '../domain/authentication.entity'
import { CreateAuthDto } from '../dto/create-auth.dto'
import { IAuthRepository } from './interfaces'

export class AuthCreatingService {
    constructor(private readonly repo: IAuthRepository) {}

    async create(dto: CreateAuthDto) {
        const user = await this.repo.findOne({ email: dto.email })

        // TODO Error => InternalError
        if (user) throw new Error('already exists user')

        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hashed = await bcrypt.hash(dto.password, saltOrRounds)

        const candidate = new Authentication()
        candidate.userId = dto.userId
        candidate.email = dto.email
        candidate.password = hashed

        const newUser = await this.repo.create(candidate)
        const { password, ...value } = newUser

        return value
    }
}
