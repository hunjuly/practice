import 'dotenv/config'
import { HttpServer, HttpServerOption, SqlDb } from 'common'
import { Repository } from './repository'
import * as router from './router'

export type Server = { http: HttpServer; db: SqlDb }

export async function close(server: Server): Promise<void> {
    await server.http.stop()
    await server.db.close()
}

export function port(): number {
    const envValue = process.env['SERVICE_PORT']

    if (!envValue) error('missing SERVICE_PORT')

    const port = parseInt(envValue)

    assert(0 < port, `wrong SERVICE_PORT, '${envValue}'`)

    return port
}

export function createDb(): SqlDb {
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

export async function start(): Promise<Server> {
    const db = createDb()

    const repository = Repository.create(db)

    const routers = [router.create(repository)]

    const option: HttpServerOption = { logger: 'tiny', statics: [{ prefix: '/', path: 'public' }] }

    const server = HttpServer.create(routers, option)

    await server.start(port())

    return { http: server, db }
}
