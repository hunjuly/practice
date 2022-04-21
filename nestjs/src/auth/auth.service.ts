import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Authentication } from './entities/authentication.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Authentication)
        private repository: Repository<Authentication>,
        private jwtService: JwtService
    ) {}

    async createAccount(userId: string, password: string) {
        const saltOrRounds = 10
        const hashed = await bcrypt.hash(password, saltOrRounds)

        const auth = new Authentication()
        auth.userId = userId
        auth.password = hashed

        await this.repository.save(auth)
    }

    async validateUser(userId: string, password: string): Promise<any> {
        return {
            id: '1',
            email: 'john'
        }

        // const user = await this.usersService.findOne(username)

        // if (user && user.password === pass) {
        //     const { password, ...result } = user
        //     return result
        // }

        return null
    }

    async login(userId: string, session: Record<string, any>) {
        const access_token = this.jwtService.sign({ id: userId })

        session.access_token = access_token

        return { access_token }
    }
}
