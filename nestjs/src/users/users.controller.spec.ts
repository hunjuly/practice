import { Test } from '@nestjs/testing'
import { fixture } from 'src/common'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

jest.mock('./users.service')

// TODO description을 REST 형식으로 하는 것은 오류.
// 이것은 e2e에서 해야 한다.
// controller도 함수명으로 한다.
describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    const userId = 'uuid#1'
    const email = 'user@mail.com'
    const password = 'pass#001'

    const user = { id: userId, email } as User

    const users = [
        { id: 'uuid#1', email: 'user1@test.com' },
        { id: 'uuid#2', email: 'user2@test.com' }
    ] as User[]

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService]
        }).compile()

        controller = module.get(UsersController)
        service = module.get(UsersService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('POST /users', async () => {
        const createDto = { email, password }

        fixture({
            object: service,
            method: 'create',
            args: [createDto],
            return: user
        })

        const recv = await controller.create(createDto)

        expect(recv).toMatchObject(user)
    })

    it('GET /users', async () => {
        const page = { offset: 0, limit: 10 }

        fixture({
            object: service,
            method: 'findAll',
            args: [page],
            return: { ...page, total: 2, items: users }
        })

        const recv = await controller.findAll(page)

        expect(recv.items).toMatchArray(users)
    })

    it('GET /users/:id', async () => {
        fixture({
            object: service,
            method: 'get',
            args: [userId],
            return: user
        })

        const recv = await controller.findOne(userId)

        expect(recv).toMatchObject(user)
    })

    it('DELETE /users/:id', async () => {
        const result = { id: userId, status: 'removed' }

        fixture({
            object: service,
            method: 'remove',
            args: [userId],
            return: result
        })

        const recv = await controller.remove(userId)

        expect(recv).toMatchObject(result)
    })

    it('PATCH /users/:id', async () => {
        const id = 'uuid#1'
        const updateDto = { password: 'newpass' }

        fixture({
            object: service,
            method: 'update',
            args: [id, updateDto],
            return: user
        })

        const recv = await controller.update(id, updateDto)

        expect(recv).toMatchObject(user)
    })
})
