import { APP_PIPE } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { SessionModule } from './session.module'
import { createConfigModule } from './config.module'
import { createOrmModule } from './orm.module'
import { LoggerModule } from './logger'
import { AuthModule } from './auth'

@Module({
    imports: [createOrmModule(), createConfigModule(), SessionModule, LoggerModule, AuthModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class GlobalModule {}
