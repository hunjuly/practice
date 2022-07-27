import { UpdateUserDto } from './dto/update-user.dto'
import { Assert, Expect } from 'src/common'
import { IUsersRepository } from './interfaces'

export class UserUpdatingService {
    constructor(private readonly repository: IUsersRepository) {}

    async exec(userId: string, dto: UpdateUserDto) {
        const success = await this.repository.update(userId, dto)

        Expect.found(success)

        const user = await this.repository.get(userId)

        Assert.truthy(user, `${userId} get failed.`)

        return user
    }
}
