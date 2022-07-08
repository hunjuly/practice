import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisService } from './redis'
import { LoggingInterceptor } from './logging-interceptor'
import { UserGuard } from 'src/auth/user.guard'
import { HttpExceptionFilter } from './http-exception.filter'
import { SessionModule } from './session.module'
import { createConfigModule } from './config'
import { createOrmModule } from './orm-factory'
import { createFileLogger } from 'src/common/winston'
import { AppLogger } from './app-logger'

@Module({
    imports: [createOrmModule(), createConfigModule(), SessionModule],
    providers: [
        // MyLogger의 constructor 코드를 옮기면 useClass를 해도 된다.
        // 그러나 constructor에서 해야 하는 일이 많아서 factory method를 사용함.
        // 그러나 MyLogger는 런타임에 지속적인 생성이 이루어 지는 경우가 아니라
        // module init에 한 번 생성되기 때문에 constructor에 넣어도 괜찮다.
        // 결론은 그냥 해봤다.
        {
            provide: AppLogger,
            useFactory: (config: ConfigService) => {
                const storagePath = config.get<string>('LOG_STORAGE_PATH')
                const storageDays = config.get<number>('LOG_STORAGE_DAYS')

                const winston = createFileLogger(storagePath, storageDays, 'app')

                return new AppLogger(winston)
            },
            inject: [ConfigService]
        },
        RedisService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        },
        // TODO
        //logging은 middleware로 해야 한다.
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        // useClass 대신에 useExisting을 사용하는 이유
        // e2e 테스트에서 UserGuard를 mocking한다.
        // useExisting을 해야 클래스를 mock로 교체할 수 있다.
        // https://docs.nestjs.com/fundamentals/testing#overriding-globally-registered-enhancers
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        UserGuard
    ],
    exports: [RedisService, AppLogger]
})
export class GlobalModule {}
