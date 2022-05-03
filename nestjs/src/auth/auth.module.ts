import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { Authentication } from './entities/authentication.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthSerializer } from './auth-serializer'
import { LocalStrategy } from 'src/auth/local.strategy'
import { UsersModule } from 'src/users/users.module'
import { APP_GUARD } from '@nestjs/core'
import { UserGuard } from 'src/auth/user.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([Authentication]),
        PassportModule.register({ session: true }),
        forwardRef(() => UsersModule)
    ],
    providers: [
        AuthService,
        AuthSerializer,
        LocalStrategy,
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        }
    ],
    exports: [AuthService, LocalStrategy]
})
export class AuthModule {}
