import { SqlDb } from 'common'
import { Seatmap, Block, Row, Seat } from './types'

export const seatmapId = 'seatmapId-1'

const blockLength = 9
const rowLength = 100
const seatLength = 100

export const totalSeatCount = blockLength * rowLength * seatLength

export function getSeatId(index: number) {
    const normalized = String(index).padStart(8, '0')

    return `seatId${normalized}`
}

export async function install(db: SqlDb): Promise<void> {
    await db.command('DROP TABLE IF EXISTS seatmapsV1, statusesV1')

    await createSeatmapsTable(db)
    await createStatusesTable(db)

    const seatmap = createSeatmap()

    await insertSeatmap(db, seatmap)
    await insertStatus(db, seatmap)
}

async function createSeatmapsTable(db: SqlDb): Promise<void> {
    const seatmaps = `CREATE TABLE seatmapsV1 (
    id VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    contents LONGTEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    )`

    await db.command(seatmaps)
}

async function createStatusesTable(db: SqlDb): Promise<void> {
    const statuses = `CREATE TABLE statusesV1 (
        seatmapId VARCHAR(64) NOT NULL,
        seatId VARCHAR(64) NOT NULL,
        status VARCHAR(16) NOT NULL,
        PRIMARY KEY (seatmapId,seatId)
        )`

    await db.command(statuses)
}

async function insertSeatmap(db: SqlDb, seatmap: Seatmap): Promise<void> {
    const contents = JSON.stringify(seatmap.blocks)

    const values = [[seatmap.id, seatmap.name, seatmap.width, seatmap.height, contents]]

    await db.insert('INSERT INTO seatmapsV1(id,name,width,height,contents) VALUES ?', [values])
}

async function insertStatus(db: SqlDb, seatmap: Seatmap): Promise<void> {
    const values: unknown[][] = []

    for (const block of seatmap.blocks) {
        for (const row of block.rows) {
            for (const seat of row.seats) {
                const value = [seatmap.id, seat.id, 'available']
                values.push(value)
            }
        }
    }

    await db.insert('INSERT INTO statusesV1(seatmapId,seatId,status) VALUES ?', [values])
}

function createSeatmap(): Seatmap {
    const blocks: Block[] = []

    const seatSize = 1.0
    let seatSequence = 0

    for (let blockIdx = 0; blockIdx < blockLength; blockIdx++) {
        const rows: Row[] = []

        for (let rowIdx = 0; rowIdx < rowLength; rowIdx++) {
            const seats: Seat[] = []

            for (let seatIdx = 0; seatIdx < seatLength; seatIdx++) {
                const id = getSeatId(seatSequence)
                const num = `Seat_${seatIdx}`
                const region = {
                    x: (blockIdx % 3) * seatLength * seatSize + seatIdx * seatSize,
                    y: Math.floor(blockIdx / 3) * rowLength * seatSize + rowIdx * seatSize,
                    width: seatSize * 0.9,
                    height: seatSize * 0.9
                }

                const seat = { id, num, region }

                seats.push(seat)

                seatSequence += 1
            }

            const id = `row_${rowIdx}`
            const name = `Row_${rowIdx}`
            const row = { id, name, seats }

            rows.push(row)
        }

        const id = `block_${blockIdx}`
        const name = `Block_${blockIdx}`
        const block = { id, name, rows }

        blocks.push(block)
    }

    return {
        id: seatmapId,
        name: '연습공연장',
        width: 3 * seatLength * seatSize,
        height: 3 * rowLength * seatSize,
        blocks
    }
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
                        id: 'seat001',
                        num: '3',
                        region: { x: 0, y: 0, width: 2, height: 2 }
                    },
                    {
                        id: 'seat002',
                        num: '2',
                        region: { x: 2, y: 0, width: 2, height: 2 }
                    },
                    {
                        id: 'seat003',
                        num: '1',
                        region: { x: 4, y: 0, width: 2, height: 2 }
                    }
                ]
            }
        ]
    }
]

notUsed(blocks)
