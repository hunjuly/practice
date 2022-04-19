import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
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

    async validateUser(username: string, pass: string): Promise<any> {
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

    async login(id: string, password: string) {
        const payload = { id }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}