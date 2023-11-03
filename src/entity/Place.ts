import { Entity, Column, BaseEntity, ObjectIdColumn, ManyToOne, ObjectId, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Place extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

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

    @ManyToOne(() => User, (user) => user.places)
    @JoinColumn({name: 'user_id', referencedColumnName: '_id'})
    creator: User
}

