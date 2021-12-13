import { SqlDb } from 'common'
import { Block, Row, Seat } from './repository'

export async function installFixtures(db: SqlDb): Promise<void> {
    await createSeatmapsTable(db)
    await createStatusesTable(db)

    const blocks = createBlocks()
    await insertSeatmap(db, blocks)
    await insertStatuses(db, blocks)
}

async function createSeatmapsTable(db: SqlDb): Promise<void> {
    const seatmaps = `CREATE TABLE seatmaps (
    id VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    contents LONGTEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    )`

    await db.command(seatmaps)
}

async function createStatusesTable(db: SqlDb): Promise<void> {
    const statuses = `CREATE TABLE statuses (
        seatId VARCHAR(64) NOT NULL,
        status VARCHAR(16) NOT NULL,
        PRIMARY KEY (seatId)
        )`

    await db.command(statuses)
}

async function insertSeatmap(db: SqlDb, blocks: Block[]): Promise<void> {
    const contents = JSON.stringify(blocks)
    const values = [['seatmapId#1', '연습공연장', contents]]

    await db.insert('INSERT INTO seatmaps(id,name,contents) VALUES ?', [values])
}

async function insertStatuses(db: SqlDb, blocks: Block[]): Promise<void> {
    const values: unknown[][] = []

    for (const block of blocks) {
        for (const row of block.rows) {
            for (const seat of row.seats) {
                const value = [seat.id, 'available']
                values.push(value)
            }
        }
    }

    await db.insert('INSERT INTO statuses(seatId,status) VALUES ?', [values])
}

function createBlocks(): Block[] {
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

const blocks = [
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

notUsed(blocks)
