import { PickType } from '@nestjs/mapped-types'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

const keys = ['id', 'email', 'isActive', 'role', 'createDate', 'updateDate', 'version'] as (keyof User)[]

export class ResponseUserDto extends PickType(User, keys) {
    @ApiProperty()
    url: string

    static create(user: User) {
        // const { id, email, isActive, role, createDate, updateDate, version } = user

        const url = `/users/${user.id}`

        const obj = {}

        for (const key of keys) {
            obj[key] = user[key]
        }

        console.log(obj)

        obj[url] = url

        return obj as ResponseUserDto
        // return { email, isActive, role, createDate, updateDate, version, url }
    }
}
