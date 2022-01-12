import { SqlDb } from 'common'

export type Region = { x: number; y: number; width: number; height: number }

export type Seat = { id: string; num: string; region: Region }

export type Row = { id: string; name: string; seats: Seat[] }

export type Block = { id: string; name: string; rows: Row[] }

export type Seatmap = { id: string; name: string; width: number; height: number; blocks: Block[] }

export type SeatStatus = { seatId: string; status: 'available' | 'hold' | 'sold' }

export function compress(statuses: SeatStatus[], status: string) {
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

    return buffer
}

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
            `SELECT id,name,width,height,contents FROM seatmaps WHERE id='${seatmapId}'`
        )

        const values = res as { id: string; name: string; contents: string; width: number; height: number }[]

        assert(values.length <= 1)

        const value = values[0]

        const blocks = JSON.parse(value.contents) as Block[]

        return { id: value.id, name: value.name, width: value.width, height: value.height, blocks }
    }

    public async getStatus(seatmapId: string): Promise<number[]> {
        const res = await this.db.query(`SELECT seatId,status FROM statuses WHERE seatmapId='${seatmapId}'`)

        const statuses = res as SeatStatus[]

        // return statuses
        const bitStatuses: number[] = []

        let index = 0
        let current = 0

        for (const status of statuses) {
            // 'hold', 'sold'
            if (status.status === 'hold') {
            }

            index = index + 1

            if (index % 64 === 0) {
                bitStatuses.push(current)
                current = 0
            }
        }

        return bitStatuses
    }

    public async setStatus(seatmapId: string, statuses: SeatStatus[]): Promise<boolean> {
        for (const status of statuses) {
            const query = `UPDATE statuses SET status = '${status.status}' WHERE seatmapId = '${seatmapId}' AND seatId = '${status.seatId}'`

            const res = await this.db.command(query)

            assert(res.affectedRows === 1)
        }

        return true
    }
}
