import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

const userArray = [
    { id: 'uuid#1', email: 'user1@test.com' },
    { id: 'uuid#2', email: 'user2@test.com' }
]

const oneUser = { id: 'uuid#1', email: 'user1@test.com' }

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
                        create: jest.fn().mockResolvedValue(oneUser),
                        findAll: jest.fn().mockResolvedValue(userArray),
                        get: jest.fn().mockResolvedValue(oneUser),
                        remove: jest.fn()
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
        const dto = {
            email: 'user1@test.com',
            password: 'pass#001'
        }

        const actual = await controller.create(dto)
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(service.create).toHaveBeenCalledWith(dto)
    })

    it('find all users ', async () => {
        const actual = await controller.findAll()
        const expected = userArray

        expect(actual).toEqual(expected)
        expect(service.findAll).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const actual = await controller.findOne('userId#1')
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(service.get).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const actual = await controller.remove('userId#2')

        expect(actual).toBeUndefined()
        expect(service.remove).toHaveBeenCalledWith('userId#2')
    })
})
