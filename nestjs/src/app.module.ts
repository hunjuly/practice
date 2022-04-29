import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { createOrmModule } from './typeorm'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { UserGuard } from './auth/user.guard'
import * as passport from 'passport'
import * as session from 'express-session'
import { SessionService } from './session'
import { LoggingInterceptor } from './common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { RedisService } from './redis'

@Module({
    imports: [
        createOrmModule(),
        UsersModule,
        FilesModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development'],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production').default('development'),
                TYPEORM_TYPE: Joi.string().default('sqlite'),
                TYPEORM_ENABLE_SYNC: Joi.boolean().default(false)
            })
        })
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        },

        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        UserGuard,
        RedisService,
        SessionService
    ]
})
export class AppModule implements NestModule {
    constructor(private readonly sessionService: SessionService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(session(this.sessionService.getOpt()), passport.initialize(), passport.session())
            .forRoutes('*')
    }
}
