import cluster from 'cluster'
import * as v1 from './v1'
import { App } from './app'
import { processCount } from './environment'

async function startPrimary() {
    await v1.install()

    log.info(`Primary ${process.pid} is running`)

    const count = processCount()

    if (1 < count) {
        createClusters(count)
    } else {
        await startCluster()
    }
}

function createClusters(numCPUs: number) {
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

    const app = new App()
    await app.start()
}

if (cluster.isPrimary) {
    void startPrimary()
} else {
    void startCluster()
}
