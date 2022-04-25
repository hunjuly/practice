import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { Authentication } from './entities/authentication.entity'
import { User } from 'src/users/entities/user.entity'

const oneAuth = { userId: 'uuid#1', password: '$2b$07$Br5.dao1K06fUHnltEtKr.boGyOrrulv3wBnn3J0alK/yZNGoy.PK' }

describe('AuthService', () => {
    let service: AuthService
    let repository: Repository<Authentication>

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(Authentication),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(oneAuth),
                        save: jest.fn().mockResolvedValue(oneAuth)
                    }
                }
            ]
        }).compile()

        service = module.get(AuthService)
        repository = module.get(getRepositoryToken(Authentication))
    })

    it('compare hash with salt ', async () => {
        const saltOrRounds = 3
        const password = 'random_password'
        const hash = await bcrypt.hash(password, saltOrRounds)

        const isMatch = await bcrypt.compare(password, hash)

        expect(isMatch).toBeTruthy()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create a user', async () => {
        const user = new User()
        user.id = 'userId#1'

        await service.createAccount(user, 'testpass')

        expect(repository.save).toHaveBeenCalledWith({
            user,
            password: expect.not.stringMatching('testpass')
        })
    })

    it('find a user', async () => {
        const user = new User()
        user.id = 'userId#1'

        const actual = await service.validateUser(user, 'testpass')

        expect(actual).toBeTruthy()

        const expected = { where: { user } }
        expect(repository.findOne).toHaveBeenCalledWith(expected)
    })
})
