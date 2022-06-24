import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { exit } from 'process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { LoggerOptions, Logger as OrmLogger, QueryRunner } from 'typeorm'

class OrmLoggerImpl implements OrmLogger {
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
    log(level: 'warn' | 'info' | 'log', message: any, queryRunner?: QueryRunner) {
        throw new Error('Method not implemented.')
    }
}

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private readonly logger = new Logger(TypeOrmConfigService.name)

    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const nodeEnv = this.configService.get<string>('NODE_ENV')
        const synchronize = this.configService.get<boolean>('TYPEORM_ENABLE_SYNC')

        if (nodeEnv === 'production' && synchronize) {
            this.logger.error('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

            exit(1)
        }

        type DatabaseType = 'mysql' | 'sqlite' | undefined

        const type = this.configService.get<DatabaseType>('TYPEORM_TYPE')
        const database = this.configService.get<string>('TYPEORM_DATABASE')

        const common = {
            type,
            synchronize,
            autoLoadEntities: true,
            logger: new OrmLoggerImpl(this.logger),
            logging: ['error', 'warn', 'info', 'log'] as LoggerOptions,
            database
        }

        if (type === 'sqlite') {
            this.logger.warn('database connection is not set. using MEMORY DB.')

            return common
        } else if (type === 'mysql') {
            const host = this.configService.get<string>('TYPEORM_HOST')
            const port = this.configService.get<number>('TYPEORM_PORT')
            const username = this.configService.get<string>('TYPEORM_USERNAME')
            const password = this.configService.get<string>('TYPEORM_PASSWORD')

            return { ...common, host, port, database, username, password }
        }

        throw new Error(`unknown TYPEORM_TYPE(${type})`)
    }
}

export async function createOrmModule() {
    return TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
        extraProviders: []
    })
}

// 다음과 같이 useFactory 사용해도 된다. docs에 위와 같이 되어있었을 뿐이다.
// TypeOrmModule.forRootAsync({
//     imports: [ConfigModule],
//     useFactory: (configService: ConfigService) => ({
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
