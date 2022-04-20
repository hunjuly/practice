import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import * as request from 'supertest'

class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        // const request = context.switchToHttp().getRequest()

        // request.user = {
        //     password: 'user#1',
        //     email: 'notused@test.net'
        // }

        return true
    }
}

export async function createApp() {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    })
        .overrideProvider(JwtAuthGuard)
        .useClass(MockAuthGuard)
        .compile()

    const app = moduleRef.createNestApplication()
    await app.init()

    return app
}

export async function closeApp(app: INestApplication) {
    return app.close()
}

export async function post(app: INestApplication, path: string, body: object) {
    return request(app.getHttpServer()).post(path).send(body)
}

export async function patch(app: INestApplication, path: string, body: object) {
    return request(app.getHttpServer()).patch(path).send(body)
}

export async function get(app: INestApplication, path: string) {
    return request(app.getHttpServer()).get(path)
}

export async function del(app: INestApplication, path: string) {
    return request(app.getHttpServer()).delete(path)
}
