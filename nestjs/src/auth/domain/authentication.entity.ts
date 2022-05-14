import { Entity, Column, UpdateDateColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class Authentication {
    @PrimaryColumn()
    id: string

    @Column()
    userId: string

    @Column()
    password: string

    @UpdateDateColumn()
    updateDate: Date
}
