import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { Service, ServiceTest } from './service'
import { SeatStatus } from './types'

export function create(service: Service, test: ServiceTest): HttpRouter {
    const router = HttpRouter.create('/v1')

    // 좌석도 조회
    router.add('get', '/seatmap', (tx: HttpTransaction) => {
        service
            .getSeatmap()
            .then((body: unknown) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    })

    // 전체좌석 상태 조회
    router.add('get', '/status', (tx: HttpTransaction) => {
        service
            .getStatuses()
            .then((body: unknown) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    })

    // 좌석 상태 업데이트 = 좌석 선점/해제, 좌석 구매/취소
    router.add('put', '/status', (tx: HttpTransaction) => {
        const statuses = tx.body() as SeatStatus[]

        service
            .setStatus(statuses)
            .then((body: boolean) => {
                tx.reply(body ? StatusCode.Ok : StatusCode.Error)
            })
            .catch(console.log)
    })

    router.add('get', '/stress/write', (tx: HttpTransaction) => {
        test.stressWrite()
            .then((body: boolean) => {
                tx.reply(body ? StatusCode.Ok : StatusCode.Error)
            })
            .catch(console.log)
    })

    return router
}
