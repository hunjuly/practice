import { Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { MyLogger } from './my-logger'

describe('Logger', () => {
    // let controller: AppController
    // let service: AppService

    // beforeEach(async () => {
    //     const app: TestingModule = await Test.createTestingModule({
    //         controllers: [AppController],
    //         providers: [AppService]
    //     }).compile()

    //     controller = app.get<AppController>(AppController)
    //     service = app.get<AppController>(AppController)
    // })

    it('logger on production', () => {
        const logger = getLogger(true)
        logger.log('log string', 'arg1', 'arg2')
        logger.error('error string', 'arg1', 'arg2')

        // const spy = jest.spyOn(service, 'getHello')

        // const actual = controller.getHello()

        // expect(actual).toEqual({ message: 'Hello World!' })
        // expect(spy).toBeCalled()
    })
})
