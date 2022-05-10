import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const users = [
    { id: 'uuid#1', email: 'user1@test.com' },
    { id: 'uuid#2', email: 'user2@test.com' }
]

const user = { id: 'uuid#1', email: 'user1@test.com' }

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(user),
                        findAll: jest.fn().mockResolvedValue({
                            offset: 0,
                            limit: 10,
                            items: users,
                            total: 2
                        }),
                        get: jest.fn().mockResolvedValue(user),
                        remove: jest.fn(),
                        count: jest.fn().mockResolvedValue(99)
                    }
                }
            ]
        }).compile()

        controller = module.get(UsersController)
        service = module.get(UsersService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('create a user', async () => {
        const dto = { email: 'user1@test.com', password: 'pass#001' }

        const actual = await controller.create(dto)
        const expected = { ...user, url: expect.anything() }

        expect(actual).toEqual(expected)
        expect(service.create).toHaveBeenCalledWith(dto)
    })

    it('find all users ', async () => {
        const pagination = { offset: 0, limit: 10 }

        const actual = await controller.findAll(pagination)
        const expected1 = { ...users[0], url: expect.anything() }
        const expected2 = { ...users[1], url: expect.anything() }

        expect(actual.items[0]).toEqual(expected1)
        expect(actual.items[1]).toEqual(expected2)
        expect(service.findAll).toHaveBeenCalledWith(pagination)
    })

    it('find a user', async () => {
        const actual = await controller.findOne('userId#1')
        const expected = { ...user, url: expect.anything() }

        expect(actual).toEqual(expected)
        expect(service.get).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        await controller.remove('userId#2')

        expect(service.remove).toHaveBeenCalledWith('userId#2')
    })
})
