import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { Repository } from './repository'

export function create(repository: Repository): HttpRouter {
    const router = HttpRouter.create('/')

    // 좌석도 조회
    router.add('get', '/seatmap', (tx: HttpTransaction) => {
        const seatmap = repository.getSeatmap()

        tx.replyJson(StatusCode.Ok, seatmap)
    })

    // 전체좌석 상태 조회
    router.add('get', '/status', (tx: HttpTransaction) => {
        const status = repository.getStatus()

        tx.replyJson(StatusCode.Ok, status)
    })

    // 좌석 상태 업데이트 = 좌석 선점/해제, 좌석 구매/취소
    router.add('put', '/seats', (tx: HttpTransaction) => {
        repository.setStatus([])

        tx.reply(StatusCode.Ok)
    })

    return router
}
