import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Authentication {
    @PrimaryColumn()
    userId: string

    @Column()
    email: string

    @Column()
    password: string

    @UpdateDateColumn()
    updateDate: Date
}
