import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

@Injectable()
export class MyLogger implements LoggerService {
    private logger: winston.Logger

    constructor(private config: ConfigService) {
        const logStore = this.config.get<string>('LOG_STORE_PATH')

        Path.mkdir(logStore)

        const transport: DailyRotateFile = new DailyRotateFile({
            dirname: logStore,
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            createSymlink: true
        })

        transport.on('rotate', function (oldFilename, newFilename) {
            console.log(oldFilename, newFilename)
        })

        this.logger = winston.createLogger({
            level: 'silly',
            format: winston.format.json(),
            transports: [
                transport,
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize({ all: true }),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    dirname: logStore,
                    filename: 'error.log',
                    level: 'error'
                })
            ],
            exceptionHandlers: [
                new winston.transports.File({
                    dirname: logStore,
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
