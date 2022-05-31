import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private usersService: UsersService) {
        super({
            usernameField: 'email',
            passwordField: 'password'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne({ email })

        const isCorrect = await this.authService.validate(user.id, password)

        if (!isCorrect) {
            throw new UnauthorizedException()
        }

        return { id: user.id, email: user.email }
    }
}
