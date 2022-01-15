export type Region = { x: number; y: number; width: number; height: number }

export type Seat = { id: string; num: string; region: Region }

export type Row = { id: string; name: string; seats: Seat[] }

export type Block = { id: string; name: string; rows: Row[] }

export type Seatmap = { id: string; name: string; width: number; height: number; blocks: Block[] }

export type SeatStatus = { seatId: string; status: 'available' | 'hold' | 'sold' }
