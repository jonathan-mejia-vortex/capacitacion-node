import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

const placeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number, required: true},
        lng: { type: Number, required: true},
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
});




@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number
}


export const Place = mongoose.model('Place', placeSchema);