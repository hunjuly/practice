import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name)

    getHello() {
        this.logger.log('instance method log')
        Logger.log('static method log')

        return { message: 'Hello World!' }
    }
}
