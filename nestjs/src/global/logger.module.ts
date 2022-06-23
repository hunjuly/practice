import { Module } from '@nestjs/common'
import { MyLogger } from 'src/common/logger'

@Module({
    providers: [MyLogger],
    exports: [MyLogger]
})
export class LoggerModule {}
