import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable, LoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { OrmLogger } from 'src/common/orm-logger'
import { createFileLogger } from './winston'

type DatabaseType = 'mysql' | 'sqlite' | undefined

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private config: ConfigService, private logger: OrmLogger) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.config.get<string>('NODE_ENV')
        const synchronize = this.config.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            Logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        const type = this.config.get<DatabaseType>('TYPEORM_TYPE')
        const database = this.config.get<string>('TYPEORM_DATABASE')

        const common = {
            type,
            synchronize,
            autoLoadEntities: true,
            logger: this.logger,
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
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
        extraProviders: [
            {
                provide: OrmLogger,
                useFactory: (config: ConfigService) => {
                    const storagePath = config.get<string>('LOG_STORAGE_PATH')
                    const storageDays = config.get<number>('LOG_STORAGE_DAYS')

                    const winston = createFileLogger(storagePath, storageDays, 'orm')

                    return new OrmLogger(winston)
                },
                inject: [ConfigService]
            }
        ]
    })
}

// 다음과 같이 useFactory 사용해도 된다. docs에 위와 같이 되어있었을 뿐이다.
// return TypeOrmModule.forRootAsync({
//     imports: [ConfigModule],
//     useFactory: (config: ConfigService) => ({
//         type: 'mysql',
//         host: config.get('HOST'),
//         port: +config.get('PORT'),
//         username: config.get('USERNAME'),
//         password: config.get('PASSWORD'),
//         database: config.get('DATABASE'),
//         entities: [],
//         synchronize: true
//     }),
//     inject: [ConfigService, OrmLogger]
// })
