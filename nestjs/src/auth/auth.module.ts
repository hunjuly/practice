import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { Authentication } from './entities/authentication.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthSerializer } from './auth-serializer'

@Module({
    imports: [
        // JwtModule.register({ secret: jwtConstants.secret, signOptions: { expiresIn: '360s' } }),
        TypeOrmModule.forFeature([Authentication]),
        PassportModule.register({ session: true })
    ],
    providers: [
        // JwtStrategy,
        AuthService,
        AuthSerializer
    ],
    exports: [AuthService]
})
export class AuthModule {}
