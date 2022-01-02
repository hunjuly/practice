import cluster from 'cluster'
import { cpus } from 'os'
import * as fixture from './fixture'
import * as app from './app'

async function startPrimary() {
    await fixture.install()

    log.info(`Primary ${process.pid} is running`)

    const numCPUs = cpus().length

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code: number, signal: string) => {
        log.info(`worker ${worker.process.pid ?? 'undefined'} died`, code, signal)

        cluster.fork()
    })
}

async function startCluster() {
    log.info(`Cluster ${process.pid} is running`)

    await app.start()
}

if (cluster.isPrimary) {
    void startPrimary()
} else {
    void startCluster()
}
