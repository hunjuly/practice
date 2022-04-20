import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { post, get } from './common'

describe('authentication (e2e)', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    let userId: string
    let accessToken: string

    // curl -X POST http://localhost:3000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
    it('create a new user', async () => {
        const res = await post(app, '/users', { email: 'test@mail.com', password: 'testpass' })

        expect(res.statusCode).toEqual(201)

        userId = res.body.id
    })

    // curl -X POST http://localhost:3000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
    it('login the user', async () => {
        const res = await post(app, '/users/login', { email: 'test@mail.com', password: 'testpass' })

        const expected = { access_token: expect.any(String) }

        expect(res.body).toEqual(expected)

        accessToken = res.body.access_token
    })

    // curl http://localhost:3000/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..."
    it('get user info with JWT', async () => {
        const res = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set({ Authorization: `Bearer ${accessToken}` })

        const expected = expect.objectContaining({
            id: userId,
            email: 'test@mail.com'
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expected)
    })

    it('logout the user', async () => {
        const res = await post(app, '/users/logout', { access_token: 'test@mail.com' })

        expect(res.statusCode).toEqual(201)
    })

    it('should be failed after logout', async () => {
        const res = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set({ Authorization: `Bearer ${accessToken}` })

        expect(res.statusCode).toEqual(401)
    })
})
