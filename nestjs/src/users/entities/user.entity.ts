import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Photo } from 'src/photos/entities/photo.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: true })
    isActive: boolean

    @OneToMany((type) => Photo, (photo) => photo.user)
    photos: Photo[]
}
