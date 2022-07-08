export * from './app-logger'
export * from './winston'

import { Module, RequestMethod } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestModule, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from 'src/global/logger/logger.middleware'

import { AppLogger } from './app-logger'
import { createFileLogger } from './winston'
import { LoggingInterceptor } from './logging-interceptor'
import { HttpExceptionFilter } from './http-exception.filter'

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter // FailResponseFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor // SuccessResponseFilter
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
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}
