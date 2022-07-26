import { Test } from '@nestjs/testing'
import { fixture } from 'src/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

jest.mock('./users.service')

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

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
        const id = 'uuid#1'
        const email = 'user@mail.com'
        const password = 'pass#001'

        const arg = { email, password }
        const retval = { id, email } as User

        fixture({
            object: service,
            method: 'create',
            args: [arg],
            return: retval
        })

        const recv = await controller.create(arg)

        expect(recv).toMatchObject(retval)
    })

    it('GET /users', async () => {
        const items = [
            { id: 'uuid#1', email: 'user1@test.com' },
            { id: 'uuid#2', email: 'user2@test.com' }
        ] as User[]

        const arg = { offset: 0, limit: 10 }

        fixture({
            object: service,
            method: 'findAll',
            args: [arg],
            return: { ...arg, total: 2, items }
        })

        const recv = await controller.findAll(arg)

        expect(recv.items).toMatchArray(items)
    })

    it('GET /users/:id', async () => {
        const id = 'uuid#1'
        const email = 'user@mail.com'

        const retval = { id, email } as User

        fixture({
            object: service,
            method: 'get',
            args: [id],
            return: retval
        })

        const recv = await controller.findOne(id)

        expect(recv).toMatchObject(retval)
    })

    it('DELETE /users/:id', async () => {
        const id = 'uuid#1'

        const retval = { id, status: 'removed' }

        fixture({
            object: service,
            method: 'remove',
            args: [id],
            return: retval
        })

        const recv = await controller.remove(id)

        expect(recv).toMatchObject(retval)
    })

    it('PATCH /users/:id', async () => {
        const id = 'uuid#1'
        const dto = { password: 'newpass' } as CreateUserDto
        const retval = { id, email: 'user@mail.com' } as User

        fixture({
            object: service,
            method: 'update',
            args: [id, dto],
            return: retval
        })

        const recv = await controller.update(id, dto)

        expect(recv).toMatchObject(retval)
    })
})
