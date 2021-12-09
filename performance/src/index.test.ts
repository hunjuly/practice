import { HttpRequest, StatusCode } from 'common'
import { close, port, waitForReady } from '.'
import { seatmap } from './domain'

describe('index', () => {
    const host = `http://localhost:${port()}`

    beforeAll(async () => {
        await waitForReady()
    }, 60 * 1000)

    afterAll(async () => {
        await close()
    })

    test('전체 좌석 상태 조회', async () => {
        const res = await HttpRequest.get(`${host}/seatmap`)

        log.info(seatmap.blocks)
        expect(res.status).toEqual(StatusCode.Ok)
    })
})
