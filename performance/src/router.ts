import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { Repository, SeatStatus } from './repository'

export function create(repository: Repository): HttpRouter {
    const router = HttpRouter.create('/')

    // 좌석도 조회
    router.add('get', '/seatmaps/:seatmapId', (tx: HttpTransaction) => {
        const seatmapId = tx.param('seatmapId')

        repository
            .getSeatmap(seatmapId)
            .then((body: unknown) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    })

    // 전체좌석 상태 조회
    router.add('get', '/seatmaps/:seatmapId/status', (tx: HttpTransaction) => {
        const seatmapId = tx.param('seatmapId')

        repository
            .getStatus(seatmapId)
            .then((body: SeatStatus[]) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    })

    // 좌석 상태 업데이트 = 좌석 선점/해제, 좌석 구매/취소
    router.add('put', '/seatmaps/:seatmapId/status', (tx: HttpTransaction) => {
        const seatmapId = tx.param('seatmapId')
        const statuses = tx.body() as SeatStatus[]

        repository
            .setStatus(seatmapId, statuses)
            .then((body: boolean) => {
                tx.reply(body ? StatusCode.Ok : StatusCode.Error)
            })
            .catch(console.log)

        tx.reply(StatusCode.Ok)
    })

    return router
}
