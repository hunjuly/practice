import { config } from 'dotenv'
import { Path } from './common'

export function getOption() {
    const mode = process.env['NODE_ENV']
    const path = Path.join(__dirname, '../', '.env.' + mode)

    config({ path })

    const type = process.env['DATABASE_TYPE'] as 'mysql' | 'sqlite' | undefined
    const host = process.env['DATABASE_HOST']
    const portText = process.env['DATABASE_PORT']
    const port = portText ? parseInt(portText) : undefined
    const username = process.env['DATABASE_USERNAME']
    const password = process.env['DATABASE_PASSWORD']
    const database = process.env['DATABASE_DATABASE']
    const synchronize = process.env['NODE_ENV'] !== 'production'

    return { type, host, port, username, password, database, synchronize, autoLoadEntities: true }
}
