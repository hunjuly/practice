import { HttpServer, HttpServerOption, SqlContainer } from 'common'
import { Repository } from './repository'
import * as fixture from './fixture'
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

async function start(): Promise<void> {
    await container.start('performanceDb', 'adminpw')

    await fixture.install(container.getDb())

    const repository = Repository.create(container.getDb())

    const routers = [router.create(repository)]

    const option: HttpServerOption = { logger: 'tiny', statics: [{ prefix: '/', path: 'public' }] }

    server = HttpServer.create(routers, option)

    return server.start(port())
}

const container = new SqlContainer()
let server: HttpServer

const promise = start()
