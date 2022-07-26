import { Entity, Column, UpdateDateColumn, PrimaryColumn } from 'typeorm'

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
