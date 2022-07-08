import * as DailyRotateFile from 'winston-daily-rotate-file'
import { Path } from 'src/common'
import * as winston from 'winston'

const format = winston.format

export function createFileLogger(storagePath: string, storageDays: number, context: string) {
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
        symlinkName: `${context}-current.log`,
        filename: `${context}-%DATE%h.log`
    })

    const errors = new DailyRotateFile({
        ...option,
        datePattern: 'YYYY-MM-DD',
        maxFiles: null,
        symlinkName: `${context}-errors.log`,
        filename: `${context}-%DATE%, err.log`,
        level: 'error'
    })

    const dev = new winston.transports.Console({
        format: format.combine(format.colorize({ all: true }), format.simple()),
        level: 'warn'
    })

    const logger = winston.createLogger({
        level: 'verbose',
        format: format.json(),
        transports: [all, errors, dev],
        exceptionHandlers: [errors]
    })

    return logger
}
