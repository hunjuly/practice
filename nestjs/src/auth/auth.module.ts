import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { Authentication } from './entities/authentication.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthSerializer } from './auth-serializer'
import { LocalStrategy } from 'src/auth/local.strategy'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Authentication]),
        PassportModule.register({ session: true }),
        forwardRef(() => UsersModule)
    ],
    providers: [AuthService, AuthSerializer, LocalStrategy],
    exports: [AuthService, LocalStrategy]
})
export class AuthModule {}
