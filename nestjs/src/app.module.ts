import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PhotosModule } from './photos/photos.module'
import { FilesModule } from './files/files.module'
import { createOrmModule } from './typeorm'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import * as session from 'express-session'
import * as passport from 'passport'

@Module({
    imports: [createOrmModule(), UsersModule, PhotosModule, FilesModule, AuthModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useExisting: JwtAuthGuard
        },
        JwtAuthGuard
    ]
})
export class AppModule implements NestModule {
    constructor() {}

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

// app.use(passport.authenticate('session'))
