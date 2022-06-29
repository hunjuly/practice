import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { OrmLoggerImpl } from './orm-logger'

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
