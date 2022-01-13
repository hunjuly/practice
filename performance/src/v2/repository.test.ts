import { SeatStatus, compress } from '.'

describe('index', () => {
    const statuses: SeatStatus[] = [
        { seatId: 'a1', status: 'hold' },
        { seatId: 'a2', status: 'hold' },
        { seatId: 'a3', status: 'sold' },
        { seatId: 'a4', status: 'available' },
        { seatId: 'a5', status: 'available' },
        { seatId: 'a6', status: 'hold' },
        { seatId: 'a7', status: 'sold' },
        { seatId: 'a8', status: 'sold' },
        { seatId: 'b1', status: 'hold' },
        { seatId: 'b2', status: 'hold' },
        { seatId: 'b3', status: 'sold' },
        { seatId: 'b4', status: 'sold' },
        { seatId: 'b5', status: 'available' },
        { seatId: 'b6', status: 'available' },
        { seatId: 'b7', status: 'hold' },
        { seatId: 'b8', status: 'sold' },
        { seatId: 'c1', status: 'hold' },
        { seatId: 'c2', status: 'sold' },
        { seatId: 'c3', status: 'hold' }
    ]

    function decompress(array: Uint8Array) {
        const statuses: string[] = []

        for (let i = 0; i < array.length; i++) {
            const element = array[i]

            statuses.push(`${0 < (element & 0x80) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x40) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x20) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x10) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x08) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x04) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x02) ? 'hold' : 'available'}`)
            statuses.push(`${0 < (element & 0x01) ? 'hold' : 'available'}`)
        }

        return statuses
    }

    test('선점 상태 압축', () => {
        const buffer = compress(statuses, 'hold')
        const array = new Uint8Array(buffer)

        //11000100 11000010 10100000
        expect(array[0]).toEqual(196)
        expect(array[1]).toEqual(194)
        expect(array[2]).toEqual(160)
    })

    test('압축 해제', () => {
        const buffer = compress(statuses, 'hold')
        const base64 = buffer.toString('base64')

        const decode = Buffer.from(base64, 'base64')
        const decodeArray = new Uint8Array(decode)

        const holdStatuses = decompress(decodeArray)
        console.log(holdStatuses)

        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].status === 'hold') {
                expect(statuses[i].status).toEqual(holdStatuses[i])
            }
        }
    })
})
