
import { HttpError } from '../models/http-error';
import mongoose from 'mongoose';
import { Place as IPlace } from '../interfaces/place-interface';
import { Place } from '../models/place';
import { User } from '../models/user';

class PlaceService {
    static async getPlaceById(placeId: string): Promise<IPlace> {
        let place = await Place.findById(placeId);
        if(!place)
            throw new HttpError('Could not find a place for the provided id.', 404);
        return place.toObject( { getters: true});
    }

    static async getPlacesByUserId(userId: string): Promise<IPlace[]> {
        // This alternative not working

        // const userWithPlaces = await User.findById(userId).populate('places');
    
        // if(!userWithPlaces || userWithPlaces.places.length === 0){
        //     throw new HttpError('Could not find places for the provided user id.', 404);
        // } 
        // const places = userWithPlaces.places.map(place => 
        //     place.toObject({ getters: true})
        // );
        // return places;

        const places = await Place.find({ creator: userId});

        if(!places || places.length === 0)
            throw new HttpError('Could not find places for the provided user id.', 404);
        return places.map(place => place.toObject({getters: true}));
    }

    static async createPlace(
        title: string,
        description: string,
        image: string,
        address: string,
        coordinates: { lat: number, lng: number},
        creator: string): Promise<IPlace> {

        const user = await User.findById(creator); 
        if(!user){
            throw new HttpError(
                'Could not find user for the provided id', 404
            );
        }

        const createdPlace = new Place({
            title,
            description,
            image,
            address,
            location: coordinates,
            creator,
        });

        console.log("User creating Place: ", user);

        const sess = await mongoose.startSession();
        sess.startTransaction();
        
        await createdPlace.save({session: sess});
        user.places.push(createdPlace.id);
        await user.save({session: sess});
        await sess.commitTransaction();

        return createdPlace.toObject( { getters: true });
    }

    static async updatePlace(
        placeId: string,
        title: string,
        description: string): Promise<IPlace> {
    
        const place = await Place.findById(placeId);
    
        place.title = title;
        place.description = description;
    
        await place.save();

        return place.toObject({getters: true});
    };


    static async deletePlace(
        placeId: string): Promise<IPlace> {
    
        const place = await Place.findById(placeId).populate('creator');
        const user = await User.findById(place.creator).populate('places');
    
        if(!place){
            throw new HttpError(
                'Could not find place for this id', 404
            );
        }

        const sess = await mongoose.startSession();
        sess.startTransaction();

        await place.deleteOne({ session: sess})
        user.places.pull(place);
        // user.places.filter(p => p.id !== placeId);
        await  user.save({ session: sess});

        await sess.commitTransaction();

        return place.toObject({getters: true});
    };
}

export default PlaceService;