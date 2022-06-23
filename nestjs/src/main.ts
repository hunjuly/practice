import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PaginatedResponse } from 'src/common'
import { getLogger } from 'src/common'

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
    const logger = getLogger(process.env.NODE_ENV === 'production')

    const app = await NestFactory.create(AppModule, { logger })

    setApiDocument(app)

    await app.listen(4000)

    console.log(`Application running on port ${await app.getUrl()}`)
}
bootstrap()
