import { Repository } from './repository'
import { SeatStatus } from './types'
import { totalSeatCount, getSeatId } from './fixture'

export class Service {
    public static create(repo: Repository): Service {
        return new Service(repo)
    }

    private readonly repo: Repository

    public constructor(repo: Repository) {
        this.repo = repo
    }

    public getSeatmap() {
        return this.repo.getSeatmap()
    }

    public async getStatuses() {
        const statuses = await this.repo.getStatuses()

        const holds = compress(statuses, 'hold').toString('base64')
        const solds = compress(statuses, 'sold').toString('base64')

        return { holds, solds }
    }

    public setStatus(statuses: SeatStatus[]) {
        return this.repo.setStatus(statuses)
    }
}

export class ServiceTest {
    public static create(service: Service): ServiceTest {
        return new ServiceTest(service)
    }

    private readonly service: Service

    public constructor(service: Service) {
        this.service = service
    }

    private writeCount = 0

    public stressWrite() {
        this.writeCount += 1

        const seatId = getSeatId(this.writeCount % totalSeatCount)
        const status = this.writeCount % 2 ? 'hold' : 'sold'

        const statuses: SeatStatus[] = [{ seatId, status }]

        return this.service.setStatus(statuses)
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
