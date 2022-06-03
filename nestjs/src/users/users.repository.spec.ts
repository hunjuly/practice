import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './domain/user.entity'
import { DeleteResult, Repository } from 'typeorm'
import { UsersRepository } from './users.repository'

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

    it('create a user', async () => {
        const candidate = { email: 'newuser@test.com' } as User
        const user = { id: 'uuid#1' } as User

        jest.spyOn(typeorm, 'findOne').mockResolvedValue(undefined)
        jest.spyOn(typeorm, 'save').mockResolvedValue(user)

        const actual = await repository.create(candidate)

        expect(actual).toEqual(user)
        expect(typeorm.save).toHaveBeenCalledWith({ email: 'newuser@test.com' })
    })

    it('find all users ', async () => {
        const users = [{ id: 'uuid#1' }, { id: 'uuid#2' }] as User[]

        jest.spyOn(typeorm, 'findAndCount').mockResolvedValue([users, 2])

        const actual = await repository.findAll({ offset: 0, limit: 10 })

        expect(actual.total).toEqual(2)
        expect(actual.items).toEqual(users)
        expect(typeorm.findAndCount).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const user = { id: 'uuid#1' } as User

        jest.spyOn(typeorm, 'findOneBy').mockResolvedValue(user)

        const actual = await repository.get('userId#1')

        expect(actual).toEqual(user)
        expect(typeorm.findOneBy).toHaveBeenCalled()
    })

    it('remove the user', async () => {
        const user = { id: 'uuid#1' } as User
        const deleteResult = { affected: 1 } as DeleteResult

        jest.spyOn(typeorm, 'findOne').mockResolvedValue(user)
        jest.spyOn(typeorm, 'delete').mockResolvedValue(deleteResult)

        await repository.remove(user.id)

        expect(typeorm.delete).toHaveBeenCalledWith(user.id)
    })
})
