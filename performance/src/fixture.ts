import { Block, Row, Seat } from './repository'

export function createBlocks(): Block[] {
    const blocks: Block[] = []

    for (let blockIdx = 0; blockIdx < 10; blockIdx++) {
        const rows: Row[] = []

        for (let rowIdx = 0; rowIdx < 100; rowIdx++) {
            const seats: Seat[] = []

            for (let seatIdx = 0; seatIdx < 100; seatIdx++) {
                const id = `seatId-${blockIdx}_${rowIdx}_${seatIdx}`
                const num = `SeatNum-${seatIdx}`
                const region = { x: 0, y: 0, width: 2, height: 2 }
                const seat = { id, num, region }

                seats.push(seat)
            }

            const id = `rowId-${blockIdx}_${rowIdx}`
            const name = `RowName-${rowIdx}`
            const row = { id, name, seats }

            rows.push(row)
        }

        const id = `blockId-${blockIdx}`
        const name = `BlockName-${blockIdx}`
        const block = { id, name, rows }

        blocks.push(block)
    }

    return blocks
}

export const blocks = [
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
                        status: 'available',
                        region: { x: 0, y: 0, width: 2, height: 2 }
                    },
                    {
                        id: 'seat0002',
                        num: '2',
                        status: 'hold',
                        region: { x: 2, y: 0, width: 2, height: 2 }
                    },
                    {
                        id: 'seat0003',
                        num: '1',
                        status: 'sold',
                        region: { x: 4, y: 0, width: 2, height: 2 }
                    }
                ]
            }
        ]
    }
]
