import { Test } from '@nestjs/testing'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    beforeEach(async () => {
        const module = await createTestingModule()

        controller = module.get<UsersController>(UsersController)
        service = module.get<UsersService>(UsersService)
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
        const expected = expect.objectContaining({
            id: expect.any(String),
            email: 'user1@test.com'
        })

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
        const actual = await controller.findOne('1')
        const expected = expect.objectContaining({
            id: '1',
            email: expect.any(String)
        })

        expect(actual).toEqual(expected)
        expect(service.findOne).toHaveBeenCalledWith('1')
    })

    it('remove the user', async () => {
        const actual = await controller.remove('2')

        expect(actual).toBeUndefined()
        expect(service.remove).toHaveBeenCalledWith('2')
    })
})

function createTestingModule() {
    return Test.createTestingModule({
        controllers: [UsersController],
        providers: [
            {
                provide: UsersService,
                useValue: {
                    create: jest
                        .fn()
                        .mockImplementation((user: CreateUserDto) =>
                            Promise.resolve({ id: 'uuid#1', ...user })
                        ),
                    findAll: jest.fn().mockResolvedValue(userArray),
                    findOne: jest
                        .fn()
                        .mockImplementation((id: string) => Promise.resolve({ ...oneUser, id })),
                    remove: jest.fn()
                }
            }
        ]
    }).compile()
}

const userArray = [
    {
        id: 'uuid#1',
        email: 'user1@test.com',
        password: 'pass#001'
    },
    {
        id: 'uuid#2',
        email: 'user2@test.com',
        password: 'pass#001'
    }
]

const oneUser = {
    id: 'uuid#1',
    email: 'user1@test.com',
    password: 'pass#001'
}
