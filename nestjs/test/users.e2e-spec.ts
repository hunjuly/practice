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
        const res = await request(app.getHttpServer()).post('/users').send({
            email: 'test@gmail.com',
            password: 'testpass'
        })

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: 'test@gmail.com'
            })
        )
    })

    it('/users (GET)', async () => {
        const res1 = await request(app.getHttpServer()).post('/users').send({
            email: 'test1@gmail.com',
            password: 'testpass'
        })

        expect(res1.statusCode).toEqual(201)

        const res2 = await request(app.getHttpServer()).post('/users').send({
            email: 'test2@gmail.com',
            password: 'testpass'
        })

        expect(res2.statusCode).toEqual(201)

        const res = await request(app.getHttpServer()).get('/users')

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
        expect(res.body).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                email: 'test1@gmail.com'
            }),
            expect.objectContaining({
                id: expect.any(String),
                email: 'test2@gmail.com'
            })
        ])
    })
})
