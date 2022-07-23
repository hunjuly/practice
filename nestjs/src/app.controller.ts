import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './global/auth/public.metadata'

@Public()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello() {
        return this.appService.getHello()
    }
}
