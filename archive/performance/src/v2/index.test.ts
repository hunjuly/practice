import { HttpRequest, StatusCode, utils } from 'common'
import { port } from '../environment'
import { App } from '../app'
import { install, getSeatId, Seatmap, SeatStatus } from '.'

describe('index', () => {
    const host = `http://localhost:${port()}/v2`
    const app = new App()

    beforeAll(async () => {
        await install()

        await app.start()
    })

    afterAll(async () => {
        await app.close()
    })

    test('좌석도 조회', async () => {
        const res = await HttpRequest.get(`${host}/seatmap`)

        const seatmap = res.json() as Seatmap

        expect(seatmap.blocks.length).toEqual(9)
    })

    test('좌석 상태 조회', async () => {
        const res = await HttpRequest.get(`${host}/status`)

        const statuses = res.json() as SeatStatus[]

        expect(statuses.length).toEqual(9 * 100 * 100)
    })

    test('좌석 상태 업데이트', async () => {
        const body = [
            { seatId: getSeatId(0), status: 'hold' },
            { seatId: getSeatId(1), status: 'sold' }
        ]

        const res = await HttpRequest.put(`${host}/status`, body)

        expect(res.status).toEqual(StatusCode.Ok)
    })

    test('업데이트 검증', async () => {
        await utils.sleep(1000)

        const res = await HttpRequest.get(`${host}/status`)
        const statuses = res.json() as SeatStatus[]

        expect(statuses[0].status).toEqual('hold')
        expect(statuses[1].status).toEqual('sold')
    })
})
