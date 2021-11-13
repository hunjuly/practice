import { HttpRouter, HttpTransaction, StatusCode } from './http'

export type PackageInfo = { name: string; version: string }

export function default_(pkgInfo: PackageInfo): HttpRouter {
    const router = HttpRouter.create('/')

    router.add('get', '/', (tx: HttpTransaction): void => {
        const res = { status: StatusCode.Ok, body: pkgInfo }

        tx.reply(res)
    })

    // 전체 좌석 상태 조회
    router.add('get', '/seatmap', (tx: HttpTransaction): void => {
        const res = { status: StatusCode.Ok, body: {} }

        tx.reply(res)
    })

    // 좌석 선점/해제
    router.add('put', '/seats', (tx: HttpTransaction): void => {
        const res = { status: StatusCode.Ok, body: {} }

        tx.reply(res)
    })

    // 티켓 구매/취소
    router.add('put', '/tickets', (tx: HttpTransaction): void => {
        const res = { status: StatusCode.Ok, body: {} }

        tx.reply(res)
    })

    return router
}
