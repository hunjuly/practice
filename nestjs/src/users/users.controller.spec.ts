import { HttpException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
    let controller: UsersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService]
        }).compile()

        controller = module.get<UsersController>(UsersController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('user 생성', async () => {
        const dto = { email: 'test@gmail.com', password: 'testpass' }
        const actual = await controller.create(dto)

        expect(actual.self).toBeDefined()
    })

    it('user 생성 실패', async () => {
        // curl -d '{ "email": "test@gmail.com", "password": "testpass" }' -H "Content-Type: application/json" -X POST http://localhost:3000/users

        const dto = { email: 'test@gmail.com' } as CreateUserDto
        const actual = await controller.create(dto)

        expect(actual.self).toBeDefined()
    })

    it('user 삭제', () => {
        const actual = controller.remove('userid')

        expect(actual).toBe('The user was deleted successfully')
    })

    it('user error', () => {
        const actual = () => controller.findAll()

        expect(actual).toThrow(HttpException)
    })
})
