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

    it('create a user', async () => {
        const oneUser = { id: 'uuid#1', email: 'user1@test.com' } as User

        jest.spyOn(service, 'create').mockResolvedValue(oneUser)

        const dto = {
            email: 'user1@test.com',
            password: 'pass#001'
        }

        const actual = await controller.create(dto)
        const expected = expect.objectContaining(oneUser)

        expect(actual).toEqual(expected)
        expect(service.create).toHaveBeenCalledWith(dto)
    })

    it('find all users ', async () => {
        const userArray = [
            { id: 'uuid#1', email: 'user1@test.com' },
            { id: 'uuid#2', email: 'user2@test.com' }
        ] as User[]

        jest.spyOn(service, 'findAll').mockResolvedValue({
            offset: 0,
            limit: 10,
            items: userArray,
            total: 2
        })

        const actual = await controller.findAll({ offset: 0, limit: 10 })
        const expected1 = expect.objectContaining(userArray[0])
        const expected2 = expect.objectContaining(userArray[1])

        expect(actual.items[0]).toEqual(expected1)
        expect(actual.items[1]).toEqual(expected2)
        expect(service.findAll).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const oneUser = { id: 'uuid#1', email: 'user1@test.com' } as User

        jest.spyOn(service, 'get').mockResolvedValue(oneUser)

        const actual = await controller.findOne('userId#1')
        const expected = expect.objectContaining(oneUser)

        expect(actual).toEqual(expected)
        expect(service.get).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const actual = await controller.remove('userId#2')

        expect(actual).toBeUndefined()
        expect(service.remove).toHaveBeenCalledWith('userId#2')
    })
})
