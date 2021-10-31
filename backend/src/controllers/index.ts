import { StatusCode, HttpRouter, HttpTransaction } from '../https'

export type PackageInfo = { name: string; version: string }

export function default_(pkgInfo: PackageInfo): HttpRouter {
    const router = HttpRouter.create('/')

    router.add('get', '/info', (tx: HttpTransaction): void => {
        const res = { status: StatusCode.Ok, body: pkgInfo }

        tx.reply(res)
    })

    return router
}
