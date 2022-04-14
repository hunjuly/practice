import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createApp, closeApp } from './common'

describe('File Upload(e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    async function uploadFile() {
        // package.json은 테스트와 무관한 상위 폴더에 존재한다.
        // 테스트 파일을 종류별로 따로 만들어라.
        const res = await request(app.getHttpServer())
            .post('/files')
            .attach('marketfile', './package.json')
            .field('fieldName', 'test')

        expect(res.statusCode).toEqual(201)

        return res
    }

    // curl -i -X POST -H "Content-Type: multipart/form-data" -F "marketfile=@package.json" -F "fieldName=abcd" "http://localhost:3000/files/upload/"
    it('/files (POST)', async () => {
        const res = await uploadFile()

        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                category: 'test',
                originalName: 'package.json',
                mimeType: 'application/json'
            })
        )
    })

    it('/files/:id (GET)', async () => {
        const createRes = await uploadFile()

        const entity = createRes.body as { id: string }

        const res = await request(app.getHttpServer()).get(`/files/${entity.id}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.objectContaining({
                id: entity.id,
                originalName: 'package.json',
                downloadUrl: expect.any(String)
            })
        )
    })

    // curl "http://localhost:3000/files/"
    it('/files (GET)', async () => {
        await uploadFile()
        await uploadFile()

        const res = await request(app.getHttpServer()).get('/files')

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)

        const expectHasId = expect.objectContaining({ id: expect.any(String) })
        expect(res.body[0]).toEqual(expectHasId)
        expect(res.body[1]).toEqual(expectHasId)
    })
})
