import { HttpRequest, StatusCode } from 'common'
import { close, port, waitForReady } from '.'

type Region = { x: number; y: number; width: number; height: number }

type Seat = { id: string; num: string; status: string; region: Region }

type Row = { id: string; name: string; seats: Seat[]; region: Region }

type Block = { id: string; name: string; rows: Row[]; region: Region }

const blocks: Block[] = [
    {
        id: 'block0001',
        name: 'A',
        rows: [
            {
                id: 'row0001',
                name: '가',
                seats: [
                    {
                        id: 'seat0001',
                        num: '3',
                        status: 'sale',
                        region: { x: 0, y: 0, width: 100, height: 100 }
                    },
                    {
                        id: 'seat0002',
                        num: '2',
                        status: 'hold',
                        region: { x: 0, y: 0, width: 100, height: 100 }
                    },
                    {
                        id: 'seat0003',
                        num: '1',
                        status: 'sold',
                        region: { x: 0, y: 0, width: 100, height: 100 }
                    }
                ],
                region: { x: 0, y: 0, width: 100, height: 100 }
            }
        ],
        region: { x: 0, y: 0, width: 100, height: 100 }
    }
]

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

        // const blocks = res.json() as Block[]
        log.info(blocks)
        expect(res.status).toEqual(StatusCode.Ok)
    })
})
