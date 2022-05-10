import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

const BaseType = PickType(User, ['id', 'email', 'role', 'createDate', 'version'])

export class ResponseUserDto extends BaseType {
    @ApiProperty()
    url: string

    static from(user: User) {
        const { auths, ...value } = user

        const url = `/users/${value.id}`

        return { ...value, url }
    }
}
