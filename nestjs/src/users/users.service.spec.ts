import { Test } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { UsersRepository } from './users.repository'
import { Authentication } from 'src/auth/entities/authentication.entity'

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
        const userId = 'uuid#1'
        const email = 'user@mail.com'
        const password = 'pass#001'

        const fixtures = {
            repo: { id: userId, email } as User,
            auth: { userId } as Authentication
        }

        jest.spyOn(repository, 'create').mockResolvedValue(fixtures.repo)
        jest.spyOn(authService, 'create').mockResolvedValue(fixtures.auth)

        const sut = { email, password }

        const actual = await service.create(sut)

        expect(actual).toMatchObject(fixtures.repo)

        expect(repository.create).toHaveBeenCalledWith({ email })
        expect(authService.create).toHaveBeenCalledWith({ userId, email, password })
    })

    it('find all users ', async () => {
        const fixture = {
            items: [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[],
            total: 2,
            offset: 0,
            limit: 10
        }

        jest.spyOn(repository, 'findAll').mockResolvedValue(fixture)

        const sut = { offset: 0, limit: 0 }

        const actual = await service.findAll(sut)

        expect(actual.items).toMatchArray(fixture.items)

        expect(repository.findAll).toHaveBeenCalledWith(sut)
    })

    it('find a user', async () => {
        const fixture = { id: 'uuid#1' } as User

        jest.spyOn(repository, 'get').mockResolvedValue(fixture)

        const sut = 'userId#1'

        const actual = await service.get(sut)

        expect(actual).toMatchObject(fixture)

        expect(repository.get).toHaveBeenCalledWith(sut)
    })

    it('remove the user', async () => {
        const userId = 'uuid#1'

        const fixtures = {
            get: { id: userId } as User,
            remove: true
        }

        jest.spyOn(repository, 'get').mockResolvedValue(fixtures.get)
        jest.spyOn(repository, 'remove').mockResolvedValue(fixtures.remove)

        const sut = userId

        const actual = await service.remove(sut)

        expect(actual).toMatchObject({ ...fixtures.get, status: 'removed' })

        expect(repository.remove).toHaveBeenCalledWith(sut)
        expect(authService.remove).toHaveBeenCalledWith(sut)
    })
})
