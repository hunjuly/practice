import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'

// curl -d '{ "email": "test@gmail.com", "password": "testpass" }' -H "Content-Type: application/json" -X POST http://localhost:3000/users
describe('UsersController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    it('/users (POST)', async () => {
        const body = { email: 'test@gmail.com', password: 'testpass' }

        const res = await request(app.getHttpServer()).post('/users').send(body)

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: 'test@gmail.com'
            })
        )
    })

    async function createUser(email: string, password: string) {
        const res = await request(app.getHttpServer()).post('/users').send({ email, password })

        expect(res.statusCode).toEqual(201)

        return res
    }

    it('/users (GET)', async () => {
        await createUser('test1@gmail.com', 'testpass')
        await createUser('test2@gmail.com', 'testpass')

        const res = await request(app.getHttpServer()).get('/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
        expect(res.body[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: 'test1@gmail.com'
            })
        )
        expect(res.body[1]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: 'test2@gmail.com'
            })
        )
    })

    it('/users/:id (GET)', async () => {
        const createRes = await createUser('test@gmail.com', 'testpass')

        const createdUser = createRes.body as { id: string; email: string }

        const res = await request(app.getHttpServer()).get(`/users/${createdUser.id}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: createdUser.id,
                email: 'test@gmail.com'
            })
        )
    })

    it('/users/:id (DELETE)', async () => {
        const createRes = await createUser('test@gmail.com', 'testpass')

        const createdUser = createRes.body as { id: string; email: string }

        const res1 = await request(app.getHttpServer()).delete(`/users/${createdUser.id}`)
        expect(res1.statusCode).toEqual(200)

        const res2 = await request(app.getHttpServer()).get(`/users/${createdUser.id}`)
        expect(res2.statusCode).toEqual(404)
    })

    it('/users/:id (PATCH)', async () => {
        const createRes = await createUser('test@gmail.com', 'testpass')

        const createdUser = createRes.body as { id: string; email: string }

        const res = await request(app.getHttpServer()).patch(`/users/${createdUser.id}`).send({
            email: 'new@gmail.com'
        })

        expect(res.statusCode).toEqual(200)

        const getRes = await request(app.getHttpServer()).get(`/users/${createdUser.id}`)

        expect(getRes.body).toEqual(
            expect.objectContaining({
                id: createdUser.id,
                email: 'new@gmail.com'
            })
        )
    })
})
