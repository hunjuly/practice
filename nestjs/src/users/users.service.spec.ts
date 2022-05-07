import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { FilesService } from 'src/files/files.service'
import { Repository } from 'typeorm'
import { AuthService } from 'src/auth/auth.service'

const userArray = [
    { id: 'uuid#1', email: 'user1@test.com' },
    { id: 'uuid#2', email: 'user2@test.com' }
]
const deleteResult = { affected: 1 }
const oneUser = { id: 'uuid#1', email: 'user1@test.com', remove: jest.fn().mockResolvedValue(deleteResult) }

jest.mock('./entities/user.entity')

const mockPlaySoundFile = jest.fn()

jest.mock('./entities/user.entity', () => {
    return {
        __esModule: true,
        User: jest.fn().mockImplementation(() => {
            return { findOne: mockPlaySoundFile, findAll: mockPlaySoundFile }
        })
    }
})
//     findOne: jest.fn().mockResolvedValue(oneUser),
//     // findOne: () => oneUser,
//     findAll: () => {
//         return { items: userArray, total: 2 }
//     },

// const userMock = jest.fn(() => {
//     return {
//         get: jest.fn(() => oneUser),
//         // add: jest.fn().mockResolvedValue(oneUser),
//         findOne: jest.fn().mockResolvedValue(oneUser),
//         // findOne: () => oneUser,
//         findAll: () => {
//             return { items: userArray, total: 2 }
//         },
//         findByEmail: () => oneUser

//         // update: jest.fn().mockResolvedValue(deleteResult)
//     }
// })

// jest.mock('./entities/user.entity', () => {
//     const originalModule = jest.requireActual('./entities/user.entity')

//     const deleteResult = { affected: 1 }
//     // const oneUser = {
//     //     id: 'uuid#1',
//     //     email: 'user1@test.com',
//     //     remove: jest.fn().mockResolvedValue(deleteResult)
//     // }
//     // const UserMock = jest.fn().mockResolvedValue({
//     //     get: jest.fn(() => oneUser),
//     //     // add: jest.fn().mockResolvedValue(oneUser),
//     //     findOne: jest.fn().mockResolvedValue(oneUser),
//     //     // findOne: () => oneUser,
//     //     findAll: () => {
//     //         return { items: userArray, total: 2 }
//     //     },
//     //     findByEmail: () => oneUser
//     //     // update: jest.fn().mockResolvedValue(deleteResult)
//     // })

//     return {
//         __esModule: true,
//         ...originalModule,
//         User: userMock
//     }
// })

describe('UsersService', () => {
    let service: UsersService
    // let repository: Repository<User>
    let authService: AuthService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: AuthService,
                    useValue: {
                        removeAccount: jest.fn()
                    }
                },
                {
                    provide: FilesService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue(userArray)
                    }
                }
            ]
        }).compile()

        service = module.get(UsersService)
        authService = module.get(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('find all users ', async () => {
        const result = await service.findAll({ offset: 0, limit: 10 })
        const expected1 = expect.objectContaining(userArray[0])
        const expected2 = expect.objectContaining(userArray[1])

        expect(result.total).toEqual(2)
        expect(result.items[0]).toEqual(expected1)
        expect(result.items[1]).toEqual(expected2)
        // expect(repository.findAndCount).toHaveBeenCalled()
    })

    it('find a user', async () => {
        const actual = await service.get('userId#1')
        const expected = oneUser

        expect(actual).toEqual(expected)
        expect(User.findOne).toHaveBeenCalledWith('userId#1')
    })

    it('remove the user', async () => {
        const actual = await service.remove('userId#2')

        expect(actual).toBeUndefined()
        // expect(repository.delete).toHaveBeenCalledWith(oneUser.id)
    })
})
