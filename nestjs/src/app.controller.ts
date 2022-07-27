import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/authentication'
import { AppService } from './app.service'

@Public()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello() {
        return this.appService.getHello()
    }
}
