import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { FilesService } from 'src/files/files.service'
import { Repository } from 'typeorm'
import { AuthService } from 'src/auth/auth.service'

const userArray = [
    { id: 'uuid#1', email: 'user1@test.com' },
    { id: 'uuid#2', email: 'user2@test.com' }
]
const oneUser = { id: 'uuid#1', email: 'user1@test.com' }
const deleteResult = { affected: 1 }

describe('UsersService(create)', () => {
    let service: UsersService
    let repository: Repository<User>
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: AuthService,
                    useValue: { createAccount: jest.fn() }
                },
                {
                    provide: FilesService,
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(undefined),
                        save: jest.fn().mockResolvedValue(oneUser)
                    }
                }
            ]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
        repository = module.get(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create a user', async () => {
        const dto = {
            email: 'newuser@test.com',
            password: 'pass#001'
        }

        const actual = await service.create(dto)
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(repository.save).toHaveBeenCalledWith({ email: 'newuser@test.com' })
        expect(authService.createAccount).toHaveBeenCalledWith(expect.any(String), 'pass#001')
    })
})

describe('UsersService', () => {
    let service: UsersService
    let repository: Repository<User>
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: AuthService,
                    useValue: {}
                },
                {
                    provide: FilesService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue(userArray)
                    }
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(oneUser),
                        find: jest.fn().mockResolvedValue(userArray),
                        save: jest.fn().mockResolvedValue(oneUser),
                        delete: jest.fn().mockResolvedValue(deleteResult)
                    }
                }
            ]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
        repository = module.get(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('find all users ', async () => {
        const actual = await service.findAll()
        const expected = userArray

        expect(actual).toEqual(expected)
        expect(repository.find).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const actual = await service.get('userId#1')
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(repository.findOne).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const actual = await service.remove('userId#2')

        expect(actual).toBeUndefined()
        expect(repository.delete).toHaveBeenCalledWith('userId#2')
    })
})
