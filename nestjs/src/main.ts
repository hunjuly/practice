import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    })

    const config = new DocumentBuilder()
        .setTitle('Practice Title')
        .setDescription('The Practice API description')
        .setVersion('1.0')
        .addCookieAuth()
        .build()

    const document = SwaggerModule.createDocument(app, config)
    const customOptions = {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: 'Practice APIs'
    }

    SwaggerModule.setup('api', app, document, customOptions)

    await app.listen(3000)

    Logger.log(`Applicationi running on port ${await app.getUrl()}`)
}
bootstrap()
