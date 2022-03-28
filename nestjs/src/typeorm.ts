import 'dotenv/config'
import { exit } from 'process'

export function getOption() {
    const type = process.env['DATABASE_TYPE'] as 'mysql' | 'sqlite' | undefined
    const host = process.env['DATABASE_HOST']
    const portText = process.env['DATABASE_PORT']
    const port = portText ? parseInt(portText) : undefined
    const username = process.env['DATABASE_USERNAME']
    const password = process.env['DATABASE_PASSWORD']
    const database = process.env['DATABASE_DATABASE']
    const synchronize = process.env['DATABASE_ENABLE_SYNC'] === 'true'

    if (type === undefined) {
        console.log(`missing process.env['DATABASE_TYPE']`)
        exit(1)
    }

    if (database === undefined) {
        console.log(`missing process.env['DATABASE_DATABASE']`)
        exit(1)
    }

    return { type, host, port, username, password, database, synchronize, autoLoadEntities: true }
}
