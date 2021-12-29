import 'dotenv/config'
import { HttpServer, HttpServerOption, SqlDb } from 'common'
import { Repository } from './repository'
import * as fixture from './fixture'
import * as router from './router'

export async function close(): Promise<void> {
    await server.stop()
}

export async function waitForReady(): Promise<void> {
    return promise
}

export function port(): number {
    const envValue = process.env['SERVICE_PORT'] as string

    assert(envValue !== undefined, 'missing SERVICE_PORT')

    const port = parseInt(envValue)

    assert(0 < port, `wrong SERVICE_PORT, '${envValue}'`)

    return port
}

function createDb(): SqlDb {
    const config = {
        host: process.env['DB_HOST'] ?? '',
        port: parseInt(process.env['DB_PORT'] ?? ''),
        user: process.env['DB_USER'] ?? '',
        password: process.env['DB_PASSWORD'] ?? '',
        database: process.env['DB_NAME'] ?? ''
    }

    const db = SqlDb.create(config)

    return db
}

async function start(): Promise<void> {
    const db = createDb()

    await fixture.install(db)

    const repository = Repository.create(db)

    const routers = [router.create(repository)]

    const option: HttpServerOption = { logger: 'tiny', statics: [{ prefix: '/', path: 'public' }] }

    server = HttpServer.create(routers, option)

    await server.start(port())
}

let server: HttpServer
const promise = start()
