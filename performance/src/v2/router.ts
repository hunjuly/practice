import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { Repository, SeatStatus } from './repository'
import { seatmapId, totalSeatCount, getSeatId } from './fixture'

export function create(repository: Repository): HttpRouter {
    const router = HttpRouter.create('/v2')

    // 좌석도 조회
    router.add('get', '/seatmap', (tx: HttpTransaction) => {
        getSeatmap(tx)
    })

    // 전체좌석 상태 조회
    router.add('get', '/status', (tx: HttpTransaction) => {
        getStatus(tx)
    })

    // 좌석 상태 업데이트 = 좌석 선점/해제, 좌석 구매/취소
    router.add('put', '/status', (tx: HttpTransaction) => {
        const statuses = tx.body() as SeatStatus[]

        putStatus(tx, statuses)
    })

    let readWriteCount = 0

    router.add('get', '/stress/readWrite', (tx: HttpTransaction) => {
        const readWriteRatio = 10
        const isWrite = readWriteCount % readWriteRatio === 0

        if (isWrite) {
            const seatId = getSeatId(readWriteCount % totalSeatCount)
            const status = readWriteCount % 2 ? 'hold' : 'sold'

            const statuses: SeatStatus[] = [{ seatId, status }]

            putStatus(tx, statuses)
        } else {
            getStatus(tx)
        }

        readWriteCount += 1
    })

    let writeCount = 0

    router.add('get', '/stress/write', (tx: HttpTransaction) => {
        const seatId = getSeatId(writeCount % totalSeatCount)
        const status = writeCount % 2 ? 'hold' : 'sold'

        const statuses: SeatStatus[] = [{ seatId, status }]

        putStatus(tx, statuses)

        writeCount += 1
    })

    const getSeatmap = (tx: HttpTransaction) => {
        repository
            .getSeatmap(seatmapId)
            .then((body: unknown) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    }

    const getStatus = (tx: HttpTransaction) => {
        repository
            .getStatus(seatmapId)
            .then((body: unknown) => {
                tx.replyJson(StatusCode.Ok, body)
            })
            .catch(console.log)
    }

    const putStatus = (tx: HttpTransaction, statuses: SeatStatus[]) => {
        repository
            .setStatus(seatmapId, statuses)
            .then((body: boolean) => {
                tx.reply(body ? StatusCode.Ok : StatusCode.Error)
            })
            .catch(console.log)
    }

    return router
}
