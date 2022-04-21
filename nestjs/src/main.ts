import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    })
    app.useGlobalInterceptors(new LoggingInterceptor())

    await app.listen(3000)

    // const logger = app.get(Logger)
    // logger.log(`Application listening at ${await app.getUrl()}`)
    Logger.log(`Applicationi running on port ${await app.getUrl()}`)
}
bootstrap()
