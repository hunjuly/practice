import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { UserGuard } from 'src/auth/user.guard'
import * as request from 'supertest'

class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        return true
    }
}

export async function createApp() {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule]
    })
        .overrideProvider(UserGuard)
        .useClass(MockAuthGuard)
        .compile()

    const app = moduleRef.createNestApplication()
    await app.init()

    return app
}

export async function closeApp(app: INestApplication) {
    return app.close()
}

function addHeader(req: request.Test, headers: object[]) {
    headers.map((header) => {
        req.set(header)
    })

    return req
}

export function post(app: INestApplication, path: string, body: object, headers: object[] = []) {
    const req = request(app.getHttpServer()).post(path).send(body)

    return addHeader(req, headers)
}

export function patch(app: INestApplication, path: string, body: object, headers: object[] = []) {
    const req = request(app.getHttpServer()).patch(path).send(body)

    return addHeader(req, headers)
}

export function get(app: INestApplication, path: string, headers: object[] = []) {
    const req = request(app.getHttpServer()).get(path)

    return addHeader(req, headers)
}

export function del(app: INestApplication, path: string, headers: object[] = []) {
    const req = request(app.getHttpServer()).delete(path)

    return addHeader(req, headers)
}
