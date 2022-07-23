import { APP_GUARD } from '@nestjs/core'
import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthSerializer } from './auth-serializer'
import { LocalStrategy } from './local.strategy'
import { UserGuard } from './user.guard'
import { UsersModule } from 'src/users/users.module'
import { AuthModule as AuthServiceModule } from 'src/auth/auth.module'

@Module({
    imports: [PassportModule.register({ session: true }), forwardRef(() => UsersModule), AuthServiceModule],
    providers: [
        AuthSerializer,
        LocalStrategy,
        // useClass 대신에 useExisting을 사용하는 이유
        // e2e 테스트에서 UserGuard를 mocking한다. useExisting을 해야 클래스를 mock로 교체할 수 있다.
        // https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        UserGuard
    ],
    exports: [LocalStrategy]
})
export class AuthModule {}
