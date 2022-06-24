import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { Logger as OrmLogger, QueryRunner } from 'typeorm'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import * as winston from 'winston'

class OrmLoggerImpl implements OrmLogger {
    private logger: winston.Logger

    constructor(private config: ConfigService) {
        this.logger = winston.createLogger({
            level: 'verbose',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple(),
                    level: 'info'
                }),
                new winston.transports.File({ filename: 'db-error.log', level: 'error' }),
                new winston.transports.File({ filename: 'db-info.log', level: 'info' }),
                new winston.transports.File({ filename: 'db-verbose.log', level: 'verbose' }),
                new winston.transports.File({ filename: 'db-combined.log' })
            ]
        })
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.verbose(query, parameters)
    }
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (error instanceof Error) {
            this.logger.error(error.message, query, parameters)
        } else {
            this.logger.error(error, query, parameters)
        }
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.warn(query, time, parameters)
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.info(message)
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.info(message)
    }
    log(level: 'warn' | 'info' | 'log', message: any, queryRunner?: QueryRunner) {
        this.logger.log(level, message)
    }
}

type DatabaseType = 'mysql' | 'sqlite' | undefined

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private config: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.config.get<string>('NODE_ENV')
        const synchronize = this.config.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            Logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        const type = this.config.get<DatabaseType>('TYPEORM_TYPE')
        const database = this.config.get<string>('TYPEORM_DATABASE')

        const logger = new OrmLoggerImpl(this.config)

        const common = {
            type,
            synchronize,
            autoLoadEntities: true,
            logger,
            logging: 'all',
            database
        }

        if (type === 'sqlite') {
            Logger.warn('database connection is not set. using MEMORY DB.')

            return common as TypeOrmModuleOptions
        } else if (type === 'mysql') {
            const host = this.config.get<string>('TYPEORM_HOST')
            const port = this.config.get<number>('TYPEORM_PORT')
            const username = this.config.get<string>('TYPEORM_USERNAME')
            const password = this.config.get<string>('TYPEORM_PASSWORD')

            return { ...common, host, port, database, username, password } as MysqlConnectionOptions
        }

        throw new Error(`unknown TYPEORM_TYPE(${type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })
}

// 다음과 같이 useFactory 사용해도 된다. docs에 위와 같이 되어있었을 뿐이다.
// TypeOrmModule.forRootAsync({
//     imports: [ConfigModule],
//     useFactory: (config: ConfigService) => ({
//         type: 'mysql',
//         host: configService.get('HOST'),
//         port: +configService.get('PORT'),
//         username: configService.get('USERNAME'),
//         password: configService.get('PASSWORD'),
//         database: configService.get('DATABASE'),
//         entities: [],
//         synchronize: true
//     }),
//     inject: [ConfigService]
// })
