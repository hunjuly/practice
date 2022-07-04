import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { transports, format, Logger, createLogger } from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'

@Injectable()
export class MyLogger implements LoggerService {
    private logger: Logger
    private storagePath: string
    private storageDays: number

    constructor(private config: ConfigService) {
        this.storagePath = this.config.get<string>('LOG_STORAGE_PATH')
        this.storageDays = this.config.get<number>('LOG_STORAGE_DAYS')

        // onModuleInit() 전에 this.logger를 호출하는 경우도 있다.
        // 생성자에서 this.logger를 초기화 하지 않으면 에러다.
        Path.mkdir(this.storagePath)

        const option = {
            dirname: this.storagePath,
            datePattern: 'YYYY-MM-DD, HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: this.storageDays + 'd',
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
            format: format.combine(format.colorize({ all: true }), format.simple())
        })

        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            transports: [all, errors, dev],
            exceptionHandlers: [errors]
        })
    }

    async onModuleInit() {}
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
