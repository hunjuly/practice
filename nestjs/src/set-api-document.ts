import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PaginatedResponse } from 'src/components'
import { getPackageInfo } from 'src/utils'

export function setApiDocument(app: INestApplication) {
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
