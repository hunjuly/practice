import { SqlDb } from 'common'

export type Region = { x: number; y: number; width: number; height: number }

export type Seat = { id: string; num: string; region: Region }

export type Row = { id: string; name: string; seats: Seat[] }

export type Block = { id: string; name: string; rows: Row[] }

export type Seatmap = { id: string; name: string; blocks: Block[] }

export type SeatStatus = { seatId: string; status: 'available' | 'hold' | 'sold' }

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

    public getSeatmap(): Seatmap {
        return { id: 'seatmap0001', name: '오늘의공연', blocks: [] }
    }

    public getStatus(): SeatStatus[] {
        return []
    }

    public setStatus(statuses: SeatStatus[]) {
        notUsed(statuses)
    }
}
