import { HttpServer, SqlContainer } from 'common'
import { seatmaps, tests } from './routers'
import { Repository } from './repository'
import { installFixtures } from './fixture'

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

    await installFixtures(container.getDb())

    const repository = Repository.create(container.getDb())

    const routers = [seatmaps.create(repository), tests.create(repository)]

    server = HttpServer.create(routers, { logger: 'tiny' })

    return server.start(port())
}

const container = new SqlContainer()
let server: HttpServer

const promise = start()
