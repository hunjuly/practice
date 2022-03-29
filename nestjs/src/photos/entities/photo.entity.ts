import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    user: string
}
