import { SqlDb } from 'common'
import { Seatmap, Block, Row, Seat } from './repository'

export async function installFixtures(db: SqlDb): Promise<void> {
    await createSeatmapsTable(db)
    await createStatusesTable(db)

    const seatmap = createSeatmap()

    await insertSeatmap(db, seatmap)
    await insertStatus(db, seatmap)
}

async function createSeatmapsTable(db: SqlDb): Promise<void> {
    const seatmaps = `CREATE TABLE seatmaps (
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
    // seat를 포함하는 것은 seatmap 외에도 block과 row가 있다.
    // 그럼에도 block과 row를 제외한 것은 당장 사용하지 않기 때문이다.
    // 향후에 기능이 확장/변경 되면서 statuses에 block과 row가 필요할 지 모른다.
    // 그러면 그 때 마이그레이션을 하면 된다.
    const statuses = `CREATE TABLE statuses (
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

    await db.insert('INSERT INTO seatmaps(id,name,width,height,contents) VALUES ?', [values])
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

    await db.insert('INSERT INTO statuses(seatmapId,seatId,status) VALUES ?', [values])
}

function createSeatmap(): Seatmap {
    const seatmapId = 'seatmapId-1'

    const blocks: Block[] = []

    for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
        const rows: Row[] = []

        for (let rowIdx = 0; rowIdx < 100; rowIdx++) {
            const seats: Seat[] = []

            for (let seatIdx = 0; seatIdx < 100; seatIdx++) {
                const id = `seatId-${seatmapId}_${blockIdx}_${rowIdx}_${seatIdx}`
                const num = `SeatNum-${seatIdx}`
                const x = (blockIdx % 3) * 110 * 2.2 + seatIdx * 2.2
                const y = Math.floor(blockIdx / 3) * 110 * 2.2 + rowIdx * 2.2
                const region = { x, y, width: 2, height: 2 }
                const seat = { id, num, region }

                seats.push(seat)
            }

            const id = `rowId-${seatmapId}_${blockIdx}_${rowIdx}`
            const name = `RowName-${rowIdx}`
            const row = { id, name, seats }

            rows.push(row)
        }

        const id = `blockId-${seatmapId}_${blockIdx}`
        const name = `BlockName-${blockIdx}`
        const block = { id, name, rows }

        blocks.push(block)
    }

    return { id: seatmapId, name: '연습공연장', width: 3 * 110 * 2.2, height: 3 * 110 * 2.2, blocks }
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
