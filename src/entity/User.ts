import { Entity, Column, BaseEntity, ObjectId, ObjectIdColumn } from "typeorm";
import { Place } from "./Place";

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column("text")
    email: string

    @Column()
    image: string

    @Column()
    password: string

    @Column()
    creator: string

    @Column()
    places: Place[]
};