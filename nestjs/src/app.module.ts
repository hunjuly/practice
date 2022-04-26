import { Inject, MiddlewareConsumer, Module, NestModule, Session } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { createOrmModule } from './typeorm'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { UserGuard } from './auth/user.guard'
import * as passport from 'passport'
import * as session from 'express-session'
import { createSessionModule, SessionService } from './session'

@Module({
    imports: [createOrmModule(), UsersModule, FilesModule, AuthModule, createSessionModule()],
    controllers: [AppController],
    providers: [
        AppService,
        // app.useGlobalGuards()로 하는 것과 뭐가 다른 건가?
        {
            provide: APP_GUARD,
            useExisting: UserGuard
        },
        UserGuard
    ]
})
export class AppModule implements NestModule {
    constructor( private readonly sessionService: SessionService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(session(this.sessionService.getOpt()), passport.initialize(), passport.session())
            .forRoutes('*')
    }
}
