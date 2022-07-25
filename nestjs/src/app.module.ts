import { APP_PIPE } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { AuthModule } from './auth/auth.module'
import { LoggerModule, createOrmModule, createConfigModule } from './common'

@Module({
    imports: [createOrmModule(), createConfigModule(), LoggerModule, UsersModule, FilesModule, AuthModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class AppModule {}
