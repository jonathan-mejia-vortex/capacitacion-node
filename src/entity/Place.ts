import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column("text")
    description: string

    @Column()
    image: string

    @Column()
    address: string

    @Column()
    location: {
        lat: number
        lng: number
    }

    @Column()
    creator: string
}

