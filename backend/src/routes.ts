import { HttpRouter, HttpTransaction, StatusCode } from 'common'

export type PackageInfo = { name: string; version: string }

export function default_(pkgInfo: PackageInfo): HttpRouter {
    const router = HttpRouter.create('/')

    router.add('get', '/', (tx: HttpTransaction): void => {
        tx.replyJson(StatusCode.Ok, pkgInfo)
    })

    // 전체 좌석 상태 조회
    router.add('get', '/seatmap', (tx: HttpTransaction): void => {
        tx.reply(StatusCode.Ok)
    })

    // 좌석 선점/해제
    router.add('put', '/seats', (tx: HttpTransaction): void => {
        tx.reply(StatusCode.Ok)
    })

    // 티켓 구매/취소
    router.add('put', '/tickets', (tx: HttpTransaction): void => {
        tx.reply(StatusCode.Ok)
    })

    return router
}
