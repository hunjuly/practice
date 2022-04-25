import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { INestApplication } from '@nestjs/common'
import { post, get, del } from './common'

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
    let cookie: string

    // curl http://localhost:3000/users -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" | jq
    it('create a new user', async () => {
        const res = await post(app, '/users', { email: 'test@mail.com', password: 'testpass' })

        expect(res.statusCode).toEqual(201)

        userId = res.body.id
    })

    // curl http://localhost:3000/users/login -d '{ "email": "test@mail.com", "password": "testpass" }' -H "Content-Type: application/json" -v
    it('login the user', async () => {
        const res = await post(app, '/users/login', { email: 'test@mail.com', password: 'testpass' })

        // < Set-Cookie: connect.sid=s%3AQu2pnp84rzMhMik5w1w8ijslwStFT1Ow0; Path=/; HttpOnly
        const cookies = res.headers['set-cookie'][0].split(';')
        cookie = cookies[0]

        expect(res.statusCode).toEqual(302)
    })

    // curl http://localhost:3000/users --cookie "connect.sid=s%3AW263OQ3h8lMvJrqGc;"
    it('get user info with JWT', async () => {
        const res = await get(app, `/users/${userId}`, [{ cookie: cookie }])

        const expected = expect.objectContaining({
            id: userId,
            email: 'test@mail.com'
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expected)
    })

    // curl -X delete http://localhost:3000/users/logout --cookie "connect.sid=s%3AW263OQ3h8lMvJrqGc;"
    it('logout the user', async () => {
        const res = await del(app, '/users/logout', [{ cookie: cookie }])

        expect(res.statusCode).toEqual(302)
    })

    it('should be failed after logout', async () => {
        const res = await get(app, `/users/${userId}`, [{ cookie: cookie }])

        expect(res.statusCode).toEqual(403)
    })
})
