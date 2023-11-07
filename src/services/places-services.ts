
import { Place as IPlace } from '../interfaces/place-interface';
import { Place } from './../entity/Place';
import { ObjectId } from 'mongodb';
import { AppDataSource } from '../data-source';
import { HttpError } from '../utils/http-error';
import { User } from '../entity/User';

class PlaceService {
    static async getPlaceById(placeId: string): Promise<IPlace> {
        const place = await AppDataSource.mongoManager.findOneBy(Place, { _id: new ObjectId(placeId)});
        if(!place)
            throw new HttpError('Could not find a place for the provided id.', 404);
        return place;
    }

    static async getPlacesByUserId(userId: string): Promise<IPlace[]> {
        const places = await AppDataSource.mongoManager.find(Place, 
            { creatorId: userId }
        );

        if(!places || places.length === 0)
            throw new HttpError('Could not find places for the provided user id.', 404);
        
        return places;
    }

    static async createPlace(
        title: string,
        description: string,
        image: string,
        address: string,
        coordinates: { lat: number, lng: number},
        creator: string,
        callback: (place) => any,
        callbackError: (onRejected) => any): Promise<void> {

        const idCreator: ObjectId = new ObjectId(creator);
        const user = await AppDataSource.mongoManager.findOneBy(User, { _id: idCreator});

        if(!user){
            throw new HttpError(
                'Could not find user for the provided id', 404
            );
        }

        const createdPlace = new Place();
        createdPlace.title = title;
        createdPlace.description = description;
        createdPlace.address = address;
        createdPlace.image = image;
        createdPlace.location = coordinates;
        createdPlace.creatorId = creator;

        console.log("User creating Place: ", user);


        return await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
            createdPlace._id = (await transactionalEntityManager.save(createdPlace))._id;
        }).then(() => {
            callback(createdPlace)
        }).catch(onRejected => callbackError(onRejected));;
    }

    static async updatePlace(
        placeId: string,
        title: string,
        description: string): Promise<IPlace> {
    
        await AppDataSource.mongoManager.updateOne(Place,
            { _id: new ObjectId(placeId) },
            { $set: { title: title, description: description } },
            { upsert: false }
        );
        const place = await AppDataSource.mongoManager.findOneBy(Place, { _id: new ObjectId(placeId)});
        
        return place;
    };

    static async deletePlace(
        placeId: string,
        callback: (place) => any,
        callbackError: (onRejected) => any): Promise<IPlace> {
    
        const place = await AppDataSource.mongoManager.findOne(Place, {
            where: { _id: new ObjectId(placeId)}
        });

        if(!place){
            throw new HttpError(
                'Could not find place for this id', 404
            );
        }

        const user = await AppDataSource.mongoManager.findOne(User, {
            where: { _id: new ObjectId(place.creatorId)},
        });

        return await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
            transactionalEntityManager.delete(Place, place);
        })
        .then(() => callback(place))
        .catch(onRejected => callbackError(onRejected));
    };
}

export default PlaceService;