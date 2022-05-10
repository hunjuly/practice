import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { DeleteResult, Repository } from 'typeorm'
import { AuthService } from 'src/auth/auth.service'

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
                    useValue: {
                        createAccount: jest.fn(),
                        removeAccount: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        findAndCount: jest.fn(),
                        delete: jest.fn(),
                        save: jest.fn()
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
        const dto = { email: 'newuser@test.com', password: 'pass#001' }
        const user = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined)
        jest.spyOn(repository, 'save').mockResolvedValue(user)

        const actual = await service.create(dto)

        expect(actual).toEqual(user)
        expect(repository.save).toHaveBeenCalledWith({ email: 'newuser@test.com' })
        expect(authService.createAccount).toHaveBeenCalledWith(user, 'pass#001')
    })

    it('find all users ', async () => {
        const users = [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[]

        jest.spyOn(repository, 'findAndCount').mockResolvedValue([users, 2])

        const actual = await service.findAll({ offset: 0, limit: 10 })

        expect(actual.total).toEqual(2)
        expect(actual.items).toEqual(users)
        expect(repository.findAndCount).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const user = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'findOne').mockResolvedValue(user)

        const actual = await service.get('userId#1')

        expect(actual).toEqual(user)
        expect(repository.findOne).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const user = { id: 'uuid#1' } as User
        const deleteResult = { affected: 1 } as DeleteResult

        jest.spyOn(repository, 'findOne').mockResolvedValue(user)
        jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult)

        await service.remove('userId#2')

        expect(repository.delete).toHaveBeenCalledWith(user.id)
    })
})
