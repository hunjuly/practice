import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { Authentication } from './entities/authentication.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '360s' }
        }),
        TypeOrmModule.forFeature([Authentication])
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
