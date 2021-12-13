import { HttpServer, SqlContainer } from 'common'
import * as router from './router'
import { Repository } from './repository'
import { createBlocks } from './fixture'

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
    const seatmaps = `CREATE TABLE seatmaps (
    id VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    contents LONGTEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    )`

    await container.getDb().command(seatmaps)

    const statuses = `CREATE TABLE statuses (
        seatId VARCHAR(64) NOT NULL,
        status VARCHAR(16) NOT NULL,
        PRIMARY KEY (seatId)
        )`

    await container.getDb().command(statuses)

    const blocks = createBlocks()
    const contents = JSON.stringify(blocks)
    const values = [['seatmapId#1', '연습공연장', contents]]

    await container.getDb().insert('INSERT INTO seatmaps(id,name,contents) VALUES ?', [values])
}

async function start(): Promise<void> {
    await container.start('performanceDb', 'adminpw')

    await initDatabase()

    const repository = Repository.create(container.getDb())

    const routers = [router.create(repository)]

    server = HttpServer.create(routers)

    return server.start(port())
}

const container = new SqlContainer()
let server: HttpServer

const promise = start()
