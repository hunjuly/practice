import { HttpRouter, HttpTransaction, StatusCode } from 'common'
import { Repository, SeatStatus } from '../repository'

let readWriteCount = 0

export function create(repository: Repository): HttpRouter {
    const router = HttpRouter.create('/')

    router.add('get', '/tests/readWriteStatus', (tx: HttpTransaction) => {
        const seatmapId = 'seatmapId-1'

        if (readWriteCount % 10 === 0) {
            const statuses = [
                { seatId: 'seatId-seatmapId-1_0_0_0', status: 'hold' },
                { seatId: 'seatId-seatmapId-1_0_0_1', status: 'sold' }
            ] as SeatStatus[]

            repository
                .setStatus(seatmapId, statuses)
                .then((body: boolean) => {
                    tx.reply(body ? StatusCode.Ok : StatusCode.Error)
                })
                .catch(console.log)
        } else {
            repository
                .getStatus(seatmapId)
                .then((body: SeatStatus[]) => {
                    tx.replyJson(StatusCode.Ok, body)
                })
                .catch(console.log)
        }

        readWriteCount = readWriteCount + 1
    })

    return router
}
