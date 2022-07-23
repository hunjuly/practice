import { Module, RequestMethod } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppLogger, createLogger } from 'src/common'
import { RequestLogger } from './request-logger'
import { ExceptionLogger } from './exception-loggers'
import { SuccessLogger } from './success-logger'

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionLogger
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessLogger
        },
        {
            provide: AppLogger,
            useFactory: (config: ConfigService) => {
                const storagePath = config.get<string>('LOG_STORAGE_PATH')
                const storageDays = config.get<number>('LOG_STORAGE_DAYS')
                const fileLevel = config.get<string>('LOG_FILE_LEVEL')
                const consoleLevel = config.get<string>('LOG_CONSOLE_LEVEL')
                const context = 'app'

                const winston = createLogger({ storagePath, storageDays, fileLevel, consoleLevel, context })

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
