import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { createOrmModule } from './typeorm'
import * as passport from 'passport'
import * as session from 'express-session'
import { SessionService } from './session'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { RedisService } from './redis'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { LoggingInterceptor } from 'src/common'

@Module({
    imports: [createOrmModule(), createConfigModule()],
    providers: [
        RedisService,
        SessionService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        },

        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ],
    exports: [RedisService, SessionService]
})
export class GlobalModule implements NestModule {
    constructor(private readonly sessionService: SessionService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(session(this.sessionService.getOpt()), passport.initialize(), passport.session())
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
