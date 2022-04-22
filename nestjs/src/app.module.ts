import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'
import { FilesModule } from './files/files.module'
import { createOrmModule } from './typeorm'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { UserGuard } from './auth/user.guard'
import * as session from 'express-session'
import * as passport from 'passport'

@Module({
    imports: [createOrmModule(), UsersModule, PhotosModule, FilesModule, AuthModule],
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
    constructor() {}

    // TODO
    // session은 typeorm처럼 받아오게 하자
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    secret: 'my-secret',
                    resave: false,
                    saveUninitialized: false
                }),
                passport.initialize(),
                passport.session()
            )
            .forRoutes('*')
    }
}
