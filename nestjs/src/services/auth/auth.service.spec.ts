import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'

import { User } from 'src/services/users/domain'

import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'

const oneAuth = { userId: 'uuid#1', password: '$2b$07$Br5.dao1K06fUHnltEtKr.boGyOrrulv3wBnn3J0alK/yZNGoy.PK' }

describe('AuthService', () => {
    let service: AuthService
    let repository: AuthRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: AuthRepository,
                    useValue: {
                        get: jest.fn().mockResolvedValue(oneAuth),
                        add: jest.fn().mockResolvedValue(oneAuth)
                    }
                }
            ]
        }).compile()

        service = module.get(AuthService)
        repository = module.get(AuthRepository)
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
        const userId = 'userId#1'
        const email = 'user@mail.com'
        const password = 'testpass'

        await service.create({ userId, email, password })

        expect(repository.create).toHaveBeenCalledWith({
            id: user.id + '_local',
            userId: user.id,
            password: expect.not.stringMatching('testpass')
        })
    })

    it('find a user', async () => {
        const user = new User()
        user.id = 'userId#1'

        const actual = await service.validate(user.id, 'testpass')

        expect(actual).toBeTruthy()
        expect(repository.get).toHaveBeenCalledWith(user.id + '_local')
    })
})
