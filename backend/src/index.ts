import { File } from 'common'
import { HttpServer } from './HttpServer'
import * as routes from './routes'

export function close(): void {
    server.stop()
}

export function port(): number {
    const envValue = process.env['SERVICE_PORT'] as string

    assert(envValue !== undefined, 'missing SERVICE_PORT')

    const port = parseInt(envValue)

    assert(!isNaN(port), `wrong SERVICE_PORT, '${envValue}'`)

    return port
}

const pkgInfo = File.readJson('package.json') as routes.PackageInfo

const routers = [routes.default_(pkgInfo)]

const server = HttpServer.create(routers)

server.start(port())
