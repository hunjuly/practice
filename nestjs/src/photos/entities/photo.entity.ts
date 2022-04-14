import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from 'src/users/entities/user.entity'

@Entity()
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne((type) => User, (user) => user.photos)
    user: User

    @Column()
    data: string
}
