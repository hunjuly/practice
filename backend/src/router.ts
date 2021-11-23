import { HttpRouter, HttpTransaction, StatusCode, SqlDb } from 'common'
import { Region } from './domain'

type Seat = { num: string; status: string; region: Region }
type Row = { name: string; seats: Seat[] }
type Block = { name: string; rows: Row[] }
type CreateSeatmapCommand = { name: string; blocks: Block[] }

export function create(_db: SqlDb): HttpRouter {
    const router = HttpRouter.create('/')

    // 좌석도 생성, db 생성 할 때 그냥 다 때려넣자
    router.add('post', '/seatmap', (tx: HttpTransaction) => {
        const value = tx.body() as CreateSeatmapCommand

        // 하여튼 여기에서 CreateSeatmapCommand 사용해서 Seatmap을 만든다.
        // Domain은 Infra나 App을 모른다.
        // CreateSeatmapCommand은 App레이어다.
        // seatmapRepository.add(seatmap)

        tx.reply(StatusCode.Ok)
    })

    // 좌석도 조회
    router.add('get', '/seatmap/', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 전체좌석 상태 조회
    router.add('get', '/status', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    // 좌석 상태 업데이트 = 좌석 선점/해제, 좌석 구매/취소
    router.add('put', '/seats', (tx: HttpTransaction) => {
        tx.reply(StatusCode.Ok)
    })

    return router
}
