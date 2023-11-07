
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

    /* NOT WORKING */
    static async getPlacesByUserId(userId: string): Promise<IPlace[]> {
        const places = await AppDataSource.mongoManager.find(Place, 
            {
                where: {
                    creator: {
                        _id: new ObjectId(userId)
                    }
                },
                relations: ['creator']
            }
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
        createdPlace.creator = user;

        console.log("User creating Place: ", user);


        return await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
            createdPlace._id = (await transactionalEntityManager.save(createdPlace))._id;
    
            let places = user.places;
            if(!places)
                places = [];
            
            places.push(createdPlace);
    
            transactionalEntityManager.update(User,
                { _id: createdPlace.creator._id },
                {  places: places }
            ).then(() => {
                callback(createdPlace)
            }).catch(onRejected => callbackError(onRejected));
        });
    }

    static async updatePlace(
        placeId: string,
        title: string,
        description: string): Promise<IPlace> {
    
        await AppDataSource.mongoManager.updateOne(Place,
            { _id: new ObjectId(placeId) },
            { $set: { title: title, description: description } },
            { upsert: true }
        );
        const place = await AppDataSource.mongoManager.findOneBy(Place, { _id: new ObjectId(placeId)});
        
        return place;
    };

    /* NOT WORKING */
    static async deletePlace(
        placeId: string,
        callback: (place) => any,
        callbackError: (onRejected) => any): Promise<IPlace> {
    
        const place = await AppDataSource.mongoManager.findOne(Place, {
            where: { _id: new ObjectId(placeId)},
            relations: ['creator']
        });

        if(!place){
            throw new HttpError(
                'Could not find place for this id', 404
            );
        }

        return await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
            let user = await transactionalEntityManager.findOneBy(User, { _id: place.creator._id});
            user.places.filter(p => p._id.id.toString() !== placeId)
            transactionalEntityManager.delete(Place, place);
            transactionalEntityManager.save(User, place.creator)
        })
        .then(callback)
        .catch(onRejected => callbackError(onRejected));
    };
}

export default PlaceService;