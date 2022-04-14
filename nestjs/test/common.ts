import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'

export async function createApp() {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    }).compile()

    const app = moduleRef.createNestApplication()
    await app.init()

    return app
}

export async function closeApp(app: INestApplication) {
    return app.close()
}
