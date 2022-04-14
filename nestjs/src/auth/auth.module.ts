import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core'

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '360s' }
        })
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ],
    exports: [AuthService]
})
export class AuthModule {}
