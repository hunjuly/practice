import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PaginatedResponse, getPackageInfo } from 'src/common'
import { MyLogger } from 'src/global/my-logger'

function setApiDocument(app: INestApplication) {
    const info = getPackageInfo()
    const config = new DocumentBuilder()
        .setTitle(info.name)
        .setDescription(info.description)
        .setVersion(info.version)
        .addCookieAuth()
        .build()

    const opt = { extraModels: [PaginatedResponse] }

    const document = SwaggerModule.createDocument(app, config, opt)

    const customOptions = {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: `${info.name} APIs`
    }

    SwaggerModule.setup('api', app, document, customOptions)
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true
    })
    app.useLogger(app.get(MyLogger))

    setApiDocument(app)

    await app.listen(4000)

    Logger.log(`Application running on port ${await app.getUrl()}`)
}
bootstrap()
