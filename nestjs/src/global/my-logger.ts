import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

@Injectable()
export class MyLogger implements LoggerService {
    private logger: Logger

    constructor(config: ConfigService) {
        const storagePath = config.get<string>('LOG_STORAGE_PATH')
        const storageDays = config.get<number>('LOG_STORAGE_DAYS')

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

        // TODO exceptionHandlers 설정하면 MaxExeed error 발생한다.
        // clear를 호출해야 하는데...어떻게?

        ref('https://stackoverflow.com/questions/63753467/how-to-close-database-connection-in-nestjs-service')

        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors, dev],
            exceptionHandlers: [errors]
        })
    }

    close() {
        this.logger.clear()
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
