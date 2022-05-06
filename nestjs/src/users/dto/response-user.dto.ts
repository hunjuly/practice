import { ApiProperty, OmitType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

export class ResponseUserDto extends OmitType(User, ['auths', 'deleteDate'] as const) {
    @ApiProperty()
    url: string

    static from(user: User) {
        const { auths, deleteDate, ...value } = user

        const url = `/users/${value.id}`

        return { ...value, url }
    }
}
