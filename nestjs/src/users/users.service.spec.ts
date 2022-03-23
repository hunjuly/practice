import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'

describe('UsersService', () => {
    let service: UsersService
    let repository: Repository<User>

    beforeEach(async () => {
        const module = await createTestingModule()

        service = module.get<UsersService>(UsersService)
        repository = module.get<Repository<User>>(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create a user', async () => {
        const dto = {
            email: 'user1@test.com',
            password: 'pass#001'
        }

        const actual = await service.create(dto)
        const expected = expect.objectContaining({
            id: expect.any(String),
            email: 'user1@test.com'
        })

        expect(actual).toEqual(expected)
        expect(repository.save).toHaveBeenCalledWith(dto)
    })

    it('find all users ', async () => {
        const actual = await service.findAll()
        const expected = userArray

        expect(actual).toEqual(expected)
        expect(repository.find).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const actual = await service.findOne('1')
        const expected = expect.objectContaining({
            id: '1',
            email: expect.any(String)
        })

        expect(actual).toEqual(expected)
        expect(repository.findOne).toHaveBeenCalledWith('1')
    })

    it('remove the user', async () => {
        const actual = await service.remove('2')

        expect(actual).toBeUndefined()
        expect(repository.delete).toHaveBeenCalledWith('2')
    })
})

function createTestingModule() {
    return Test.createTestingModule({
        providers: [
            UsersService,
            {
                provide: getRepositoryToken(User),
                useValue: {
                    find: jest.fn().mockResolvedValue(userArray),
                    findOne: jest
                        .fn()
                        .mockImplementation((id: string) => Promise.resolve({ ...oneUser, id })),
                    save: jest
                        .fn()
                        .mockImplementation((user: CreateUserDto) =>
                            Promise.resolve({ id: 'uuid#1', ...user })
                        ),
                    remove: jest.fn(),
                    delete: jest.fn()
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
