import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

@Injectable()
export class MyLogger implements LoggerService {
    private logger: Logger

    constructor(private config: ConfigService) {
        const storagePath = this.config.get<string>('LOG_STORAGE_PATH')
        Path.mkdir(storagePath)

        const storageDays = this.config.get<number>('LOG_STORAGE_DAYS')

        const transport: DailyRotateFile = new DailyRotateFile({
            dirname: storagePath,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: storageDays + 'd',
            createSymlink: true,
            format: format.combine(format.timestamp(), format.prettyPrint())
        })

        transport.on('rotate', function (oldFilename, newFilename) {
            console.log(oldFilename, newFilename)
        })

        this.logger = createLogger({
            level: 'silly',
            format: format.json(),
            transports: [
                transport,
                new transports.Console({
                    format: format.combine(format.colorize({ all: true }), format.simple())
                }),
                new transports.File({
                    dirname: storagePath,
                    filename: 'error.log',
                    level: 'error'
                })
            ],
            exceptionHandlers: [
                new transports.File({
                    dirname: storagePath,
                    filename: 'error.log'
                })
            ]
        })
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
