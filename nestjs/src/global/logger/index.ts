export * from './app-logger'
export * from './winston'

import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppLogger } from './app-logger'
import { createFileLogger } from './winston'

@Module({
    providers: [
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
export class LoggerModule {}
