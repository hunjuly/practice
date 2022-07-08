import { Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global/global.module'

import { NestModule, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from 'src/global/logger.middleware'

@Module({
    imports: [GlobalModule, UsersModule, FilesModule, AuthModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
