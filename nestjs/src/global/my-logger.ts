import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as winston from 'winston'

// var winston = require('winston');
// var fs = require( 'fs' );
// var path = require('path');
// var logDir = 'log'; // directory path you want to set
// if ( !fs.existsSync( logDir ) ) {
//     // Create the directory if it does not exist
//     fs.mkdirSync( logDir );
// }
// var logger = new (winston.Logger)({
//     transports: [
//         new (winston.transports.Console)({
//             colorize: 'all'
//         }),
//         new (winston.transports.File)({filename: path.join(logDir, '/log.txt')})
//     ]
// });
// logger.info("Anything you want to write in logfile");

// --------------winston-daily-rotate-file
// import  *  as  winston  from  'winston';
// import  DailyRotateFile from 'winston-daily-rotate-file';

// const transport: DailyRotateFile = new DailyRotateFile({
//     filename: 'application-%DATE%.log',
//     datePattern: 'YYYY-MM-DD-HH',
//     zippedArchive: true,
//     maxSize: '20m',
//     maxFiles: '14d'
//   });

// transport.on('rotate', function(oldFilename, newFilename) {
//       // do something fun
//     });

// const logger = winston.createLogger({
// transports: [
//   transport
// ]});

// logger.info('Hello World!');

@Injectable()
export class MyLogger implements LoggerService {
    private logger: winston.Logger

    constructor(private config: ConfigService) {
        const logStore = this.config.get<string>('LOG_STORE_PATH')

        this.logger = winston.createLogger({
            level: 'silly',
            format: winston.format.logstash(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple()
                }),
                new winston.transports.File({
                    dirname: logStore,
                    filename: 'error.log',
                    level: 'error'
                }),
                new winston.transports.File({
                    dirname: logStore,
                    filename: 'combined.log'
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
