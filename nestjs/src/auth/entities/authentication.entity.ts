import { User } from 'src/users/entities/user.entity'
import { Entity, Column, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Authentication {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.auths)
    user: User

    @Column()
    password: string

    @UpdateDateColumn()
    updateDate: Date
}
