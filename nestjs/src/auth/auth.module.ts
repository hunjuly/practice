import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { Authentication } from './entities/authentication.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthSerializer } from './serialization.provider'

@Module({
    imports: [
        TypeOrmModule.forFeature([Authentication]),
        PassportModule.register({ session: true }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '360s' }
        })
    ],
    providers: [AuthService, JwtStrategy, AuthSerializer],
    exports: [AuthService]
})
export class AuthModule {}
