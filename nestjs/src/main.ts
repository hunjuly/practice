import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PaginatedResponse, getPackageInfo } from 'src/common'
import { AppLogger } from 'src/global/logger'

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
        // Logger는 configService에 의존한다.
        // bufferLogs: true로 하면 config에 문제가 있는 경우 로그를 출력하지 못한다.
        bufferLogs: false,
        cors: true
    })

    const logger = app.get(AppLogger)
    app.useLogger(logger)

    setApiDocument(app)

    await app.listen(4000)

    // 이것은 log가 아니다. console로 출력하는 것이 맞다.
    console.log(`Application running on port ${await app.getUrl()}`)
}
bootstrap()
