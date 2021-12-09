import { HttpServer, SqlContainer } from 'common'
import * as router from './router'

export async function close(): Promise<void> {
    await server.stop()
    await container.stop()
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

async function initDatabase(): Promise<void> {
    const stmt = `CREATE TABLE seatmaps (
    id VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    text LONGTEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id))`

    await container.getDb().command(stmt)
}

async function start(): Promise<void> {
    await container.start('performanceDb')
    await initDatabase()

    const routers = [router.create(container.getDb())]

    server = HttpServer.create(routers)

    return server.start(port())
}

const container = new SqlContainer()
let server: HttpServer

const promise = start()
