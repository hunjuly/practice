import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
    let controller: AppController
    let service: AppService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile()

        controller = app.get<AppController>(AppController)
        service = app.get<AppController>(AppController)
    })

    it('"Hello World!"', () => {
        const spy = jest.spyOn(service, 'getHello')

        const actual = controller.getHello()

        expect(actual).toEqual({ message: 'Hello World!' })
        expect(spy).toBeCalled()
    })
})
