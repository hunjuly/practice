import { cpus } from 'os'
import { SqlDb } from 'common'

export function createSqlDb(): SqlDb {
    const host = process.env['DB_HOST']
    const dbPort = process.env['DB_PORT']
    const user = process.env['DB_USER']
    const password = process.env['DB_PASSWORD']
    const database = process.env['DB_NAME']

    if (host && dbPort && user && password && database) {
        const port = parseInt(dbPort)

        const db = SqlDb.create({ host, port, user, password, database })

        return db
    }

    error('missing config.')
}

export function port(): number {
    const value = process.env['SERVICE_PORT']

    if (!value) error('missing SERVICE_PORT')

    const port = parseInt(value)

    assert(0 < port, `wrong SERVICE_PORT, '${value}'`)

    return port
}

export function processCount(): number {
    const value = process.env['PROCESS_COUNT']

    if (value) {
        const port = parseInt(value)

        if (0 < port) return port
    }

    return cpus().length
}
