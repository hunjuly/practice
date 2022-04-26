import 'dotenv/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { exit } from 'process'

type DatabaseType = 'mysql' | 'sqlite' | undefined
const type = process.env['TYPEORM_TYPE'] as DatabaseType
const host = process.env['TYPEORM_HOST']
const portText = process.env['TYPEORM_PORT']
const port = portText ? parseInt(portText) : undefined
const username = process.env['TYPEORM_USERNAME']
const password = process.env['TYPEORM_PASSWORD']
const database = process.env['TYPEORM_DATABASE']
const synchronize = process.env['TYPEORM_ENABLE_SYNC'] === 'true'

if (synchronize && process.env['NODE_ENV'] === 'production') {
    console.log('Do not use synchronize(TYPEORM_ENABLE_SYNC) on production')

    exit(1)
}

export let ormOption: TypeOrmModuleOptions = {
    type: 'sqlite' as DatabaseType,
    database: ':memory:',
    synchronize: true,
    autoLoadEntities: true,
    logger: 'advanced-console',
    logging: ['error', 'warn', 'info', 'log']
}

if (type && host && portText && port && username && password && database && synchronize) {
    ormOption = {
        type,
        host,
        port,
        username,
        password,
        database,
        synchronize,
        autoLoadEntities: true
    }
} else {
    console.log('WARNING database connection is not set. using MEMORY DB.')
}

export function createOrmModule() {
    return TypeOrmModule.forRoot(ormOption)
}
