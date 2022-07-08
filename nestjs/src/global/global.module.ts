import { APP_PIPE, APP_GUARD } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { UserGuard } from 'src/auth/user.guard'
import { SessionModule } from './session.module'
import { createConfigModule } from './config.module'
import { createOrmModule } from './orm.module'
import { LoggerModule } from './logger'

@Module({
    imports: [createOrmModule(), createConfigModule(), SessionModule, LoggerModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        },
        // useClass 대신에 useExisting을 사용하는 이유
        // e2e 테스트에서 UserGuard를 mocking한다. useExisting을 해야 클래스를 mock로 교체할 수 있다.
        // https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        UserGuard
    ]
})
export class GlobalModule {}
