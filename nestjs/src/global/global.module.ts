import { APP_PIPE } from '@nestjs/core'
import { Module, ValidationPipe } from '@nestjs/common'
import { SessionModule } from './session.module'
import { createConfigModule } from './config.module'
import { createOrmModule } from './orm'
import { LoggerModule } from './logger'

@Module({
    imports: [createOrmModule(), createConfigModule(), SessionModule, LoggerModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ transform: true })
        }
    ]
})
export class GlobalModule {}
