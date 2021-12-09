export type Region = { x: number; y: number; width: number; height: number }

export type Seat = { id: string; num: string; status: string; region: Region }

export type Row = { id: string; name: string; seats: Seat[] }

export type Block = { id: string; name: string; rows: Row[] }

export type Seatmap = { id: string; name: string; blocks: Block[] }

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
                ]
            }
        ]
    }
]

export const seatmap: Seatmap = {
    id: 'seatmap0001',
    name: '오늘의공연',
    blocks
}
