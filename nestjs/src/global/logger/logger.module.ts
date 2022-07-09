import { Module, RequestMethod } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppLogger } from './app-logger'
import { createFileLogger } from './winston'
import { RequestLogger } from './request-logger'
import { SuccessResLogger, FailResLogger } from './response-loggers'

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: FailResLogger
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessResLogger
        },
        {
            provide: AppLogger,
            useFactory: (config: ConfigService) => {
                const storagePath = config.get<string>('LOG_STORAGE_PATH')
                const storageDays = config.get<number>('LOG_STORAGE_DAYS')

                const winston = createFileLogger(storagePath, storageDays, 'app')

                return new AppLogger(winston)
            },
            inject: [ConfigService]
        }
    ]
})
export class LoggerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLogger).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
