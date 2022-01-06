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
    const envValue = process.env['SERVICE_PORT']

    if (!envValue) error('missing SERVICE_PORT')

    const port = parseInt(envValue)

    assert(0 < port, `wrong SERVICE_PORT, '${envValue}'`)

    return port
}
