import 'dotenv/config'
import { TypeOrmModule } from '@nestjs/typeorm'

export function getOrmModule() {
    const type = process.env['DATABASE_TYPE'] as 'mysql' | 'sqlite' | undefined
    const host = process.env['DATABASE_HOST']
    const portText = process.env['DATABASE_PORT']
    const port = portText ? parseInt(portText) : undefined
    const username = process.env['DATABASE_USERNAME']
    const password = process.env['DATABASE_PASSWORD']
    const database = process.env['DATABASE_DATABASE']
    const synchronize = process.env['DATABASE_ENABLE_SYNC'] === 'true'

    if (type && host && portText && port && username && password && database && synchronize) {
        return TypeOrmModule.forRoot({
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            autoLoadEntities: true
        })
    }

    console.log('WARNING database connection is not set. using MEMORY DB.')

    return TypeOrmModule.forRoot({
        type: 'sqlite' as 'mysql' | 'sqlite' | undefined,
        database: ':memory:',
        synchronize: true,
        autoLoadEntities: true,
        host,
        port,
        username,
        password
    })
}
