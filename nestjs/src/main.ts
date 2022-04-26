import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { LoggingInterceptor } from './common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    })
    app.useGlobalInterceptors(new LoggingInterceptor())

    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build()
    const document = SwaggerModule.createDocument(app, config)

    const customOptions = {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: 'My API Docs'
    }

    SwaggerModule.setup('api', app, document, customOptions)

    await app.listen(3000)

    Logger.log(`Applicationi running on port ${await app.getUrl()}`)
}
bootstrap()
