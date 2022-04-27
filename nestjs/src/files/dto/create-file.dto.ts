import { PickType } from '@nestjs/mapped-types'
import { Entity } from 'typeorm'

export class CreateFileDto {
    originalName: string
    mimeType: string
    path: string
    size: number
    fieldName: string
}

// export class CreateFilePartialDto extends PickType(CreateFileDto, ['fieldName'] as const) {}
// export class CreateFilePartialDto {
//     fieldName: string
// }
