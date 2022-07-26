import { Test } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { UsersRepository } from './users.repository'
import { Authentication } from 'src/auth/entities/authentication.entity'
import { fixture } from 'src/common'

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
        const id = 'uuid#1'
        const userId = id
        const email = 'user@mail.com'
        const password = 'pass#001'

        fixture({
            object: repository,
            method: 'create',
            args: [{ email }],
            return: { id, email } as User
        })

        fixture({
            object: authService,
            method: 'create',
            args: [{ userId, email, password }],
            return: { userId, email } as Authentication
        })

        const recv = await service.create({ email, password })

        expect(recv).toMatchObject({ id, email })
    })

    it('find all users ', async () => {
        const items = [
            { id: 'uuid#1', email: 'user1@test.com' },
            { id: 'uuid#2', email: 'user2@test.com' }
        ] as User[]

        const arg = { offset: 0, limit: 10 }

        fixture({
            object: repository,
            method: 'findAll',
            args: [arg],
            return: { ...arg, total: 2, items }
        })

        const recv = await service.findAll(arg)

        expect(recv.items).toMatchArray(items)
    })

    it('find a user', async () => {
        const id = 'uuid#1'
        const email = 'user@mail.com'

        const retval = { id, email } as User

        fixture({
            object: repository,
            method: 'get',
            args: [id],
            return: retval
        })

        const recv = await service.get(id)

        expect(recv).toMatchObject(retval)
    })

    it('remove the user', async () => {
        const id = 'uuid#1'

        const arg = id
        const retval = { id } as User

        fixture({
            object: repository,
            method: 'get',
            args: [arg],
            return: retval
        })

        fixture({
            object: repository,
            method: 'remove',
            args: [arg],
            return: true
        })

        const recv = await service.remove(arg)

        expect(recv).toMatchObject({ ...retval, status: 'removed' })
    })
})
