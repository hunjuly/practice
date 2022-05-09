import { Test } from '@nestjs/testing'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { AuthService } from 'src/auth/auth.service'
import { CreateUserDto } from './dto/create-user.dto'

describe('UsersService', () => {
    let service: UsersService
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
                }
            ]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
    })

    afterEach(jest.resetAllMocks)

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create a user', async () => {
        const user = { id: 'uuid#1' } as User
        const dto = { password: 'pass#001' } as CreateUserDto

        const spy = jest.spyOn(User, 'add').mockResolvedValue(user)

        const actual = await service.create(dto)

        expect(actual).toEqual(user)
        expect(authService.createAccount).toHaveBeenCalledWith(user, 'pass#001')
        expect(spy).toHaveBeenCalledWith(dto)
    })

    it('find all users ', async () => {
        const users = [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[]
        const pagination = { offset: 0, limit: 10 }

        const spy = jest.spyOn(User, 'findAll').mockResolvedValue({ items: users, total: 2 })

        const actual = await service.findAll(pagination)

        expect(actual.total).toEqual(2)
        expect(actual.items).toEqual(users)
        expect(spy).toHaveBeenCalledWith(pagination)
    })

    it('find a user', async () => {
        const user = { id: 'uuid#1' } as User

        const spy = jest.spyOn(User, 'findOne').mockResolvedValue(user)

        const actual = await service.get('userId#1')

        expect(actual).toEqual(user)
        expect(spy).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const user = {
            remove: function () {}
        } as User

        const spyFind = jest.spyOn(User, 'findOne').mockResolvedValue(user)
        const spyRemove = jest.spyOn(user, 'remove')

        await service.remove('userId#2')

        expect(spyFind).toHaveBeenCalledWith('userId#2')
        expect(spyRemove).toHaveBeenCalled()
    })
})
