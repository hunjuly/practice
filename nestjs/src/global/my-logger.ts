import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'
import OrmLogger from './orm-logger'

WinstonLogger(?)로 분리하고
const logger:Logger = WinstonLogger.create()

const logger1 = new MyLogger(logger)
const logger2 = new OrmLogger(logger)

@Injectable()
export class MyLogger implements LoggerService {
    public static create(config: ConfigService) {
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
            filename: '%DATE%, err.log',
            level: 'error'
        })

        const dev = new transports.Console({
            format: format.combine(format.colorize({ all: true }), format.simple()),
            level: 'error'
        })

        const logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors, dev],
            exceptionHandlers: [errors]
        })

        return logger
    }

    constructor(private logger: Logger) {}

    async onModuleInit() {}
    async onModuleDestroy() {
        await this.logger.close()
    }

    log(message: any, ...optionalParams: any[]) {
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
