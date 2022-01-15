import { SqlDb } from 'common'
import { Seatmap, Block, SeatStatus, CompressedStatus } from './types'

export class Repository {
    public static create(db: SqlDb) {
        return new Repository(db)
    }

    private db: SqlDb

    constructor(db: SqlDb) {
        this.db = db
    }

    public add(seatmap: Seatmap) {
        notUsed(seatmap)
    }

    public async getSeatmap(seatmapId: string): Promise<Seatmap> {
        const res = await this.db.query(
            `SELECT id,name,width,height,contents FROM seatmapsV2 WHERE id='${seatmapId}'`
        )

        const values = res as { id: string; name: string; contents: string; width: number; height: number }[]

        assert(values.length <= 1)

        const value = values[0]

        const blocks = JSON.parse(value.contents) as Block[]

        return { id: value.id, name: value.name, width: value.width, height: value.height, blocks }
    }

    public async getStatuses(seatmapId: string): Promise<CompressedStatus> {
        const res = await this.db.query(
            `SELECT seatId,status FROM statusesV2 WHERE seatmapId='${seatmapId}' ORDER BY sequence`
        )

        const statuses = res as SeatStatus[]

        const holds = compress(statuses, 'hold').toString('base64')
        const solds = compress(statuses, 'sold').toString('base64')

        return { holds, solds }
    }

    public async setStatus(seatmapId: string, statuses: SeatStatus[]): Promise<boolean> {
        for (const status of statuses) {
            const query = `UPDATE statusesV2 SET status = '${status.status}' WHERE seatmapId = '${seatmapId}' AND seatId = '${status.seatId}'`

            const res = await this.db.command(query)

            assert(res.affectedRows === 1)
        }

        return true
    }
}

export function compress(statuses: SeatStatus[], status: string): Buffer {
    const size = Math.ceil(statuses.length / 8)

    const buffer = new ArrayBuffer(size)
    const array = new Uint8Array(buffer)

    let mask = 0
    let index = 0
    let arrayIdx = 0

    for (const item of statuses) {
        mask <<= 1

        if (item.status === status) {
            mask += 1
        }

        index = index + 1

        if (index % 8 === 0) {
            array[arrayIdx] = mask
            mask = 0
            arrayIdx += 1
        }
    }

    mask <<= 8 - (index % 8)
    array[arrayIdx] = mask

    return Buffer.from(buffer)
}
