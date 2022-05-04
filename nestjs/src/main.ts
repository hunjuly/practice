import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PaginatedResponse } from 'src/common/pagination'

function setApiDocument(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Practice Title')
        .setDescription('The Practice API description')
        .setVersion('1.0')
        .addCookieAuth()
        .build()

    const opt = { extraModels: [PaginatedResponse] }

    const document = SwaggerModule.createDocument(app, config, opt)

    const customOptions = {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: 'Practice APIs'
    }

    SwaggerModule.setup('api', app, document, customOptions)
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    })

    setApiDocument(app)

    await app.listen(3000)

    Logger.log(`Application running on port ${await app.getUrl()}`)
}
bootstrap()
