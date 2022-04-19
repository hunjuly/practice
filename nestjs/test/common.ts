import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

export class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()

        request.user = {
            id: 'user#1',
            email: 'notused@test.net'
        }

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
