import 'dotenv/config'
import cluster from 'cluster'
import { cpus } from 'os'
import { HttpServer, HttpServerOption, SqlDb } from 'common'
import { Repository } from './repository'
import * as fixture from './fixture'
import * as router from './router'

function port(): number {
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

    const repository = Repository.create(db)

    const routers = [router.create(repository)]

    const option: HttpServerOption = { logger: 'tiny', statics: [{ prefix: '/', path: 'public' }] }

    const server = HttpServer.create(routers, option)

    await server.start(port())
}

if (cluster.isPrimary) {
    const db = createDb()

    fixture
        .install(db)
        .then(() => {
            console.log(`Master ${process.pid} is running`)

            const numCPUs = cpus().length

            for (let i = 0; i < numCPUs; i++) {
                cluster.fork()
            }

            cluster.on('exit', (worker, code: number, signal: string) => {
                console.log(`worker ${worker.process.pid ?? 'undefined'} died`, code, signal)

                cluster.fork()
            })

            void db.close()
        })
        .catch(console.log)
} else {
    console.log(`Cluster ${process.pid} is running`)

    void start()
}
