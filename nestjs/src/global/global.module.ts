import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, APP_GUARD } from '@nestjs/core'
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import * as passport from 'passport'
import * as session from 'express-session'
import { createOrmModule } from './typeorm'
import { SessionService } from './session'
import { RedisService } from './redis'
import { LoggingInterceptor } from './logging-interceptor'
import { UserGuard } from 'src/auth/user.guard'
import { HttpExceptionFilter } from './http-exception.filter'
import { MyLogger } from './my-logger'

@Module({
    imports: [createOrmModule(), createConfigModule()],
    providers: [
        MyLogger,
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
        {
            provide: APP_GUARD,
            useClass: UserGuard
        }
    ],
    exports: [RedisService, MyLogger]
})
export class GlobalModule implements NestModule {
    constructor(private readonly sessionService: SessionService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(session(this.sessionService.createOption()), passport.initialize(), passport.session())
            .forRoutes('*')
    }
}

async function createConfigModule() {
    return ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ['.env.development'],
        validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production'),
            TYPEORM_TYPE: Joi.string().valid('sqlite', 'mysql'),
            SESSION_TYPE: Joi.string().valid('memory', 'redis'),
            TYPEORM_ENABLE_SYNC: Joi.boolean().default(false)
        })
    })
}
