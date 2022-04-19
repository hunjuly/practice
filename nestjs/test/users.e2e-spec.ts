import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createApp, closeApp } from './common'

describe('UsersController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    async function createUser(email = 'default@ignore.com', password = 'default') {
        const res = await request(app.getHttpServer()).post('/users').send({ email, password })

        expect(res.statusCode).toEqual(201)

        return res
    }

    // curl -d '{ "email": "test@gmail.com", "password": "testpass" }' -H "Content-Type: application/json" -X POST http://localhost:3000/users
    it('/users (POST)', async () => {
        const res = await createUser('test@gmail.com', 'testpass')

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: 'test@gmail.com'
            })
        )
    })

    // it('/users/:id/profile (GET)', () => {
    //     return request(app.getHttpServer()).get('/profile').expect(200)
    // })

    it('/users/:id (GET)', async () => {
        const createRes = await createUser('test2@gmail.com')

        const entity = createRes.body as { id: string }

        const res = await request(app.getHttpServer()).get(`/users/${entity.id}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: entity.id,
                email: 'test2@gmail.com'
            })
        )
    })

    it('password는 노출되면 안 된다.', async () => {
        const createRes = await createUser('test2@gmail.com')

        const entity = createRes.body as { id: string }

        const res = await request(app.getHttpServer()).get(`/users/${entity.id}`)

        expect(res.body).not.toEqual(
            expect.objectContaining({
                password: expect.any(String)
            })
        )
    })

    it('/users (GET)', async () => {
        await createUser()
        await createUser()

        const res = await request(app.getHttpServer()).get('/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)

        const expectHasId = expect.objectContaining({ id: expect.any(String) })
        expect(res.body[0]).toEqual(expectHasId)
        expect(res.body[1]).toEqual(expectHasId)
    })

    it('/users/:id (DELETE)', async () => {
        const createRes = await createUser()

        const entity = createRes.body as { id: string }

        const res1 = await request(app.getHttpServer()).delete(`/users/${entity.id}`)
        expect(res1.statusCode).toEqual(200)

        const res2 = await request(app.getHttpServer()).get(`/users/${entity.id}`)
        expect(res2.statusCode).toEqual(404)
    })

    it('/users/:id (PATCH)', async () => {
        const createRes = await createUser()

        const entity = createRes.body as { id: string }

        const res = await request(app.getHttpServer()).patch(`/users/${entity.id}`).send({
            email: 'new@gmail.com'
        })

        expect(res.statusCode).toEqual(200)

        const getRes = await request(app.getHttpServer()).get(`/users/${entity.id}`)

        expect(getRes.body).toEqual(
            expect.objectContaining({
                id: entity.id,
                email: 'new@gmail.com'
            })
        )
    })
})
