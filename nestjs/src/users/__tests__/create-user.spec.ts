import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { UsersService } from '../users.service'
import { FilesService } from 'src/files/files.service'
import { Repository } from 'typeorm'
import { AuthService } from 'src/auth/auth.service'

const oneUser = { id: 'uuid#1', email: 'user1@test.com' }

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
                    useValue: {
                        createAccount: jest.fn()
                    }
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
        expect(authService.createAccount).toHaveBeenCalledWith(oneUser, 'pass#001')
    })
})
