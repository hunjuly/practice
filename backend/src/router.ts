import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { SqlDb } from 'common'

export function create(_db: SqlDb): HttpRouter {
    const router = HttpRouter.create('/')

    // 좌석도 생성/조회
    router.add('get', '/seatmap', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 전체 좌석 상태 조회
    router.add('get', '/seatmap', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 좌석 선점/해제
    router.add('get', '/seats', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 좌석 선점/해제
    router.add('put', '/seats', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 티켓 구매/취소
    router.add('put', '/tickets', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    return router
}
