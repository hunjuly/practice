import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { FilesService } from 'src/files/files.service'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AuthService } from 'src/auth/auth.service'

function createTestingModule() {
    return Test.createTestingModule({
        providers: [
            UsersService,
            {
                provide: AuthService,
                useValue: {
                    createAccount: jest.fn()
                }
            },
            {
                provide: FilesService,
                useValue: {
                    create: jest.fn().mockResolvedValue(oneUser),
                    findAll: jest.fn().mockResolvedValue(userArray),
                    findOne: jest.fn().mockResolvedValue(oneUser),
                    remove: jest.fn()
                }
            },
            {
                provide: getRepositoryToken(User),
                useValue: {
                    find: jest.fn().mockResolvedValue(userArray),
                    findOne: jest.fn().mockResolvedValue(oneUser),
                    save: jest.fn().mockResolvedValue(oneUser),
                    delete: jest.fn().mockResolvedValue(deleteResult)
                }
            }
        ]
    }).compile()
}

const userArray = [
    { id: 'uuid#1', email: 'user1@test.com' },
    { id: 'uuid#2', email: 'user2@test.com' }
]
const oneUser = { id: 'uuid#1', email: 'user1@test.com' }
const deleteResult = { affected: 1 }

describe('UsersService', () => {
    let service: UsersService
    let repository: Repository<User>
    let authService: AuthService

    beforeEach(async () => {
        const module = await createTestingModule()

        service = module.get<UsersService>(UsersService)
        authService = module.get<AuthService>(AuthService)

        repository = module.get<Repository<User>>(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('compare hash with salt ', async () => {
        const saltOrRounds = 3
        const password = 'random_password'
        const hash = await bcrypt.hash(password, saltOrRounds)

        const isMatch = await bcrypt.compare(password, hash)

        expect(isMatch).toBeTruthy()
    })

    it('create a user', async () => {
        const dto = {
            email: 'user@test.com',
            password: 'pass#001'
        }

        const actual = await service.create(dto)
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(repository.save).toHaveBeenCalledWith({ email: 'user@test.com' })
        expect(authService.createAccount).toHaveBeenCalledWith(expect.any(String), 'pass#001')
    })

    it('find all users ', async () => {
        const actual = await service.findAll()
        const expected = userArray

        expect(actual).toEqual(expected)
        expect(repository.find).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const actual = await service.findOne('userId#1')
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
