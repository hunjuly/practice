import { Test } from '@nestjs/testing'
import { User } from './domain/user.entity'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { UsersRepository } from './users.repository'

jest.mock('src/auth/auth.service')
jest.mock('./users.repository')

describe('UsersService', () => {
    let service: UsersService
    let repository: UsersRepository
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService, AuthService, UsersRepository]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
        repository = module.get(UsersRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create a user', async () => {
        const dto = { email: 'newuser@test.com', password: 'pass#001' }
        const user = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'create').mockResolvedValue(user)

        const actual = await service.create(dto)

        expect(actual).toEqual(user)
        expect(repository.create).toHaveBeenCalledWith({ email: 'newuser@test.com' })
        expect(authService.add).toHaveBeenCalledWith(user.id, 'pass#001')
    })

    it('find all users ', async () => {
        const users = [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[]
        const result = {
            items: users,
            total: 2,
            offset: 0,
            limit: 10
        }

        jest.spyOn(repository, 'findAll').mockResolvedValue(result)

        const actual = await service.findAll({ offset: 0, limit: 10 })

        expect(actual).toEqual(result)
        expect(repository.findAll).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const user = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'get').mockResolvedValue(user)

        const actual = await service.get('userId#1')

        expect(actual).toEqual(user)
        expect(repository.get).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const user = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'get').mockResolvedValue(user)
        jest.spyOn(repository, 'remove').mockResolvedValue(true)

        await service.remove('userId#2')

        expect(repository.remove).toHaveBeenCalledWith('userId#2')
        expect(authService.removeByUser).toHaveBeenCalledWith('userId#2')
    })
})
