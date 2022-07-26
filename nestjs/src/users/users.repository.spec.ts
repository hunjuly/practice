import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DeleteResult, Repository } from 'typeorm'
import { UsersRepository } from './users.repository'
import { fixture } from 'src/common'

describe('UsersRepository', () => {
    let repository: UsersRepository
    let typeorm: Repository<User>

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersRepository,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        findOneBy: jest.fn(),
                        findAndCount: jest.fn(),
                        count: jest.fn(),
                        delete: jest.fn(),
                        save: jest.fn()
                    }
                }
            ]
        }).compile()

        repository = module.get(UsersRepository)
        typeorm = module.get(getRepositoryToken(User))
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    it('create', async () => {
        const candidateUser = { email: 'newuser@test.com' } as User
        const createdUser = { ...candidateUser, id: 'uuid#1' } as User

        fixture({
            object: typeorm,
            method: 'save',
            args: [candidateUser],
            return: createdUser
        })

        fixture({
            object: typeorm,
            method: 'findOne',
            args: [],
            return: undefined
        })

        const recv = await repository.create(candidateUser)

        expect(recv).toEqual(createdUser)
    })

    it('findAll', async () => {
        const users = [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[]

        jest.spyOn(typeorm, 'findAndCount').mockResolvedValue([users, 2])

        const recv = await repository.findAll({ offset: 0, limit: 10 })

        expect(recv.total).toEqual(2)
        expect(recv.items).toEqual(users)
        expect(typeorm.findAndCount).toHaveBeenCalled()
    })

    it('get', async () => {
        const user = { id: 'uuid#1' } as User

        jest.spyOn(typeorm, 'findOneBy').mockResolvedValue(user)

        const recv = await repository.get('userId#1')

        expect(recv).toEqual(user)
        expect(typeorm.findOneBy).toHaveBeenCalled()
    })

    it('remove', async () => {
        const user = { id: 'uuid#1' } as User
        const deleteResult = { affected: 1 } as DeleteResult

        jest.spyOn(typeorm, 'findOne').mockResolvedValue(user)
        jest.spyOn(typeorm, 'delete').mockResolvedValue(deleteResult)

        await repository.remove(user.id)

        expect(typeorm.delete).toHaveBeenCalledWith(user.id)
    })
})
