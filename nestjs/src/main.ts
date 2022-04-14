import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common'
import * as session from 'express-session'
import passport from 'passport'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false
        })
    )
    app.use(passport.authenticate('session'))

    app.useGlobalInterceptors(new LoggingInterceptor())
    await app.listen(3000)
}
bootstrap()
