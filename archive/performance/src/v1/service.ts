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

    public getStatuses() {
        return this.repo.getStatuses()
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
