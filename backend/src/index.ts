import { HttpServer, File } from 'common'
import * as router from './router'

export function close(): Promise<void> {
    return server.stop()
}

export function starting(): Promise<void> {
    return promise
}

export function port(): number {
    const envValue = process.env['SERVICE_PORT'] as string

    assert(envValue !== undefined, 'missing SERVICE_PORT')

    const port = parseInt(envValue)

    assert(!isNaN(port), `wrong SERVICE_PORT, '${envValue}'`)

    return port
}

const pkgInfo = File.readJson('package.json') as router.PackageInfo

const routers = [router.create(pkgInfo)]

const server = HttpServer.create(routers)

const promise = server.start(port())
