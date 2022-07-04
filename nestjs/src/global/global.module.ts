import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import * as passport from 'passport'
import * as session from 'express-session'
import { createOrmModule } from './orm-factory'
import { SessionService } from './session'
import { RedisService } from './redis'
import { LoggingInterceptor } from './logging-interceptor'
import { UserGuard } from 'src/auth/user.guard'
import { HttpExceptionFilter } from './http-exception.filter'
import { MyLogger } from './my-logger'
import { createConfigModule } from './config'
import OrmLogger from './orm-logger'

@Module({
    imports: [createOrmModule(), createConfigModule()],
    providers: [
        MyLogger,
        // useFactory로 다시 해봐라
        // {
        //     provide: MyLogger,
        //     useFactory: myLoggerFactory,
        //     inject: [ConfigService]
        // },
        RedisService,
        SessionService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        },
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
    exports: [RedisService]
})
export class GlobalModule implements NestModule {
    constructor(private readonly sessionService: SessionService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(session(this.sessionService.createOption()), passport.initialize(), passport.session())
            .forRoutes('*')
    }
}
