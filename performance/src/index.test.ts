import { HttpRequest, StatusCode, utils } from 'common'
import { Seatmap, SeatStatus } from './repository'
import { close, port, waitForReady } from '.'

describe('index', () => {
    const host = `http://localhost:${port()}`

    beforeAll(async () => {
        await waitForReady()
    }, 60 * 1000)

    afterAll(async () => {
        await close()
    })

    test('좌석도 조회', async () => {
        const res = await HttpRequest.get(`${host}/seatmaps/seatmapId-1`)

        const seatmap = res.json() as Seatmap

        expect(seatmap.id).toEqual('seatmapId-1')
        expect(seatmap.name).toEqual('연습공연장')
        expect(seatmap.blocks.length).toEqual(10)
    })

    test('좌석 상태 조회', async () => {
        const res = await HttpRequest.get(`${host}/seatmaps/seatmapId-1/status`)

        const statuses = res.json() as SeatStatus[]

        expect(statuses.length).toEqual(10 * 100 * 100)
    })

    test('좌석 상태 업데이트', async () => {
        const body = [
            { seatId: 'seatId-seatmapId-1_0_0_0', status: 'hold' },
            { seatId: 'seatId-seatmapId-1_0_0_1', status: 'sold' }
        ]

        const res = await HttpRequest.put(`${host}/seatmaps/seatmapId-1/status`, body)

        expect(res.status).toEqual(StatusCode.Ok)
    })

    test('업데이트 검증', async () => {
        await utils.sleep(1000)

        const res = await HttpRequest.get(`${host}/seatmaps/seatmapId-1/status`)
        const statuses = res.json() as SeatStatus[]

        expect(statuses[0].status).toEqual('hold')
        expect(statuses[1].status).toEqual('sold')
    })
})
