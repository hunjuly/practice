import { Test } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

jest.mock('./users.service')

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService]
        }).compile()

        controller = module.get(UsersController)
        service = module.get(UsersService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('POST /users', async () => {
        const fixture = { id: 'uuid#1', email: 'return@test.com' } as User

        jest.spyOn(service, 'create').mockResolvedValue(fixture)

        const sut = { email: 'request@test.com', password: 'pass#001' }

        const actual = await controller.create(sut)

        expect(actual).toMatchObject(fixture)

        expect(service.create).toHaveBeenCalledWith(sut)
    })

    it('GET /users', async () => {
        const fixture = {
            offset: 0,
            limit: 10,
            items: [
                { id: 'uuid#1', email: 'user1@test.com' },
                { id: 'uuid#2', email: 'user2@test.com' }
            ] as User[],
            total: 2
        }

        jest.spyOn(service, 'findAll').mockResolvedValue(fixture)

        const sut = { offset: 0, limit: 0 }

        const actual = await controller.findAll(sut)

        expect(actual.items).toMatchArray(fixture.items)

        expect(service.findAll).toHaveBeenCalledWith(sut)
    })

    it('GET /users/:id', async () => {
        const fixture = { id: 'uuid#1', email: 'user1@test.com' } as User

        jest.spyOn(service, 'get').mockResolvedValue(fixture)

        const sut = 'userId#1'

        const actual = await controller.findOne(sut)

        expect(actual).toMatchObject(fixture)

        expect(service.get).toHaveBeenCalledWith(sut)
    })

    it('DELETE /users/:id', async () => {
        const fixture = { id: 'uuid#1', status: 'removed' }

        jest.spyOn(service, 'remove').mockResolvedValue(fixture)

        const sut = 'userId#2'

        const actual = await controller.remove(sut)

        expect(actual).toMatchObject(fixture)

        expect(service.remove).toHaveBeenCalledWith(sut)
    })

    it('PATCH /users/:id', async () => {
        const fixture = { id: 'uuid#1', email: 'user1@test.com' } as User

        jest.spyOn(service, 'update').mockResolvedValue(fixture)

        const sut: any[] = ['userId#2', { password: 'newpass' }]

        const actual = await controller.update(sut[0], sut[1])

        expect(actual).toMatchObject(fixture)

        expect(service.update).toHaveBeenCalledWith(...sut)
    })
})
