import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

import { AppModule } from 'src/app.module'
import { AppLogger } from 'src/logger'

async function createApp() {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile()

    const app = moduleRef.createNestApplication(undefined)

    const logger = app.get(AppLogger)
    app.useLogger(logger)

    await app.init()

    return app
}

async function closeApp(app: INestApplication) {
    return app.close()
}

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        app = await createApp()
    })

    afterEach(async () => {
        await closeApp(app)
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect({ message: 'Hello World!' })
    })
})
