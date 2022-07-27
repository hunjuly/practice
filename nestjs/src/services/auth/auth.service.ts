import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { AuthRepository } from './auth.repository'
import { AuthCreatingService } from './domain/auth.creating.service'
import { AuthQuery } from './domain/interfaces'
import { CreateAuthDto } from './dto/create-auth.dto'

@Injectable()
export class AuthService {
    constructor(private repository: AuthRepository) {}

    async create(dto: CreateAuthDto) {
        const service = new AuthCreatingService(this.repository)

        const auth = await service.create(dto)
        return auth
    }

    async remove(userId: string) {
        const count = await this.repository.remove(userId)

        if (count === 0) {
            throw new NotFoundException()
        }
    }

    async validate(userId: string, password: string) {
        const auth = await this.repository.findOne({ userId })

        if (!auth) {
            throw new NotFoundException({ message: 'user not found' }, 'description')
        }

        return bcrypt.compare(password, auth.password)
    }

    async findOne(query: AuthQuery) {
        const user = await this.repository.findOne(query)

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }
}
