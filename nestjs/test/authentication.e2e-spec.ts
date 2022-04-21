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

    // curl http://localhost:3000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
    it('create a new user', async () => {
        const res = await post(app, '/users', { email: 'test@mail.com', password: 'testpass' })

        expect(res.statusCode).toEqual(201)

        userId = res.body.id
    })

    // curl http://localhost:3000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v| jq
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

// < HTTP/1.1 201 Created
// < X-Powered-By: Express
// < Content-Type: application/json; charset=utf-8
// < Content-Length: 206
// < ETag: W/"ce-bF/hnGuTD1O8o7SpA786nJz77WE"
// < Set-Cookie: connect.sid=s%3AQu2pnp84rzMhMi_zPipBgI6SZdRmX7Xy.4YU6uom6I3m0P0dPip5jVV96k5w1w8ijslwStFT1Ow0; Path=/; HttpOnly
// < Date: Thu, 21 Apr 2022 09:13:12 GMT
// < Connection: keep-alive
// < Keep-Alive: timeout=5
// curl http://localhost:3000/users --cookie "connect.sid=s%3AWmVZ3FKk3VsuWBbDWc5gjG0SOm7gFPfu.HfT3YqSv%2BjIn%2FXjHClm6EfchJYH2ivQUDcj8QVZetb8;" -v | jq


curl http://localhost:3000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq;
curl http://localhost:3000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v| jq
curl http://localhost:3000/users --cookie "connect.sid=s%3AxpNykqrxYDkzgtnlYO48g9RPiGwOSGMx.xDpj%2B3nqWPUVX3mhV7D7X2fThrhzv30hkaMykfvVpwg;" -v | jq
