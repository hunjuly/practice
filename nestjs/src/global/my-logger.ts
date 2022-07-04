import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

@Injectable()
export class MyLogger implements LoggerService {
    private logger: Logger

    constructor(private config: ConfigService) {}

    async onModuleInit() {
        const storagePath = this.config.get<string>('LOG_STORAGE_PATH')
        const storageDays = this.config.get<number>('LOG_STORAGE_DAYS')

        Path.mkdir(storagePath)

        const option = {
            dirname: storagePath,
            datePattern: 'YYYY-MM-DD, HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: storageDays + 'd',
            createSymlink: true,
            format: format.combine(format.timestamp(), format.prettyPrint())
        }

        const all = new DailyRotateFile({
            ...option,
            symlinkName: 'current.log',
            filename: '%DATE%h.log'
        })

        const errors = new DailyRotateFile({
            ...option,
            datePattern: 'YYYY-MM-DD',
            maxFiles: null,
            symlinkName: 'errors.log',
            filename: '%DATE%.error.log',
            level: 'error'
        })

        const dev = new transports.Console({
            format: format.combine(format.colorize({ all: true }), format.simple())
        })

        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors, dev],
            exceptionHandlers: [errors]
        })
    }
    async onModuleDestroy() {
        await this.logger.close()
    }

    log(message: any, ...optionalParams: any[]) {
        // this.logger.log('info', message, optionalParams)
        this.logger.info(message, optionalParams)
    }

    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, optionalParams)
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, optionalParams)
    }

    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, optionalParams)
    }

    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, optionalParams)
    }
}

// useFactory로 다시 해봐라
// export function myLoggerFactory(config: ConfigService) {
//     const storagePath = config.get<string>('LOG_STORAGE_PATH')
//     const storageDays = config.get<number>('LOG_STORAGE_DAYS')

//     Path.mkdir(storagePath)

//     const option = {
//         dirname: storagePath,
//         datePattern: 'YYYY-MM-DD, HH',
//         zippedArchive: true,
//         maxSize: '20m',
//         maxFiles: storageDays + 'd',
//         createSymlink: true,
//         format: format.combine(format.timestamp(), format.prettyPrint())
//     }

//     const all = new DailyRotateFile({
//         ...option,
//         filename: '%DATE%.log'
//     })

//     const errors = new DailyRotateFile({
//         ...option,
//         filename: '%DATE%.error.log',
//         level: 'error'
//     })

//     const dev = new transports.Console({
//         format: format.combine(format.colorize({ all: true }), format.simple())
//     })

//     const logger = createLogger({
//         level: 'info',
//         format: format.json(),
//         transports: [all, errors, dev],
//         exceptionHandlers: [errors]
//     })

//     return logger
// }
