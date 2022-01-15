import { SqlDb } from 'common'
import { Seatmap, Block, SeatStatus } from './types'
import { seatmapId } from './fixture'

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

    public async getSeatmap() {
        const res = await this.db.query(
            `SELECT id,name,width,height,contents FROM seatmapsV2 WHERE id='${seatmapId}'`
        )

        const values = res as { id: string; name: string; contents: string; width: number; height: number }[]

        assert(values.length <= 1)

        const value = values[0]

        const blocks = JSON.parse(value.contents) as Block[]

        return { id: value.id, name: value.name, width: value.width, height: value.height, blocks }
    }

    public async getStatuses() {
        const res = await this.db.query(
            `SELECT seatId, status FROM statusesV2 WHERE seatmapId='${seatmapId}' ORDER BY sequence`
        )

        return res as SeatStatus[]
    }

    public async setStatus(statuses: SeatStatus[]) {
        for (const status of statuses) {
            const query = `UPDATE statusesV2 SET status = '${status.status}' WHERE seatmapId = '${seatmapId}' AND seatId = '${status.seatId}'`

            const res = await this.db.command(query)

            assert(res.affectedRows === 1)
        }

        return true
    }
}
