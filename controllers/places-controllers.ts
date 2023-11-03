import { HttpError } from '../src/utils/http-error';
import { validationResult } from "express-validator";
import { getCoordsForAdress } from '../src/utils/location';
import { Place } from '../src/entity/Place';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import { ObjectId } from 'mongodb';


export const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await AppDataSource.mongoManager.findOneBy(Place, { _id: new ObjectId(placeId)});
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not find a place', 500
        );
        return next(errorHttp);
    }

    if(!place){
        const errorHttp = new HttpError('Could not find a place for the provided id.', 404);
        return next(errorHttp);
    } 
    res.json({place});
};

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await AppDataSource.mongoManager.find(Place, {
            creator: { 
                _id: new ObjectId(userId)
            }
        });
    } catch (error) {
        const errorHttp = new HttpError(
            'Fetching places failed, please try again later', 500
        );
        return next(errorHttp);
    }

    if(!places || places.length === 0){
        const errorHttp = new HttpError('Could not find places for the provided user id ', 404);
        return next(errorHttp);
    } 

    res.json({places});
};

export const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAdress(address);
    } catch (error) {
        return next(error);
    }

    let user: User;
    try {
        user = await AppDataSource.mongoManager.findOneBy(User, { _id: new ObjectId(creator)});
    } catch (error) {
        const errorHttp = new HttpError(
            'Creating place failed, please try again ' + error, 500
        );
        return next(errorHttp);
    }

    if(!user){
        const errorHttp = new HttpError(
            'Could not find user for the provided id', 404
        );
        return next(errorHttp);
    }

    const createdPlace = new Place();
    createdPlace.title = title;
    createdPlace.description = description;
    createdPlace.address = address;
    createdPlace.image = "image";
    createdPlace.location = coordinates;
    createdPlace.creator = user;

    console.log("User creating Place: ", user);

    await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
        createdPlace._id = (await transactionalEntityManager.save(createdPlace))._id;

        let places = user.places;
        if(!places)
            places = [];
        
        places.push(createdPlace);

        transactionalEntityManager.update(User,
            { _id: new ObjectId(createdPlace.creator._id) },
            {  places: places }
        );
    }).then(() => {
        createdPlace.creator.places = [];
        res.status(201).json({createdPlace});
    }).catch(onRejected => {
        const errorHttp = new HttpError(
            'Creating place failed, please try again ' + onRejected, 500
        );
        return next(errorHttp);
    });
};

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    const { title, description } = req.body;
    const placeId = req.params.pid; 

    let place: Place;
    try {
        
        AppDataSource.mongoManager.updateOne(Place,
            { _id: new ObjectId(placeId) },
            { $set: { title: title, description: description } },
            { upsert: true }
        );
        place = await AppDataSource.mongoManager.findOneBy(Place, { _id: new ObjectId(placeId)});
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not updete place ' + error, 500
        );
        return next(errorHttp);
    }
    res.status(200).json({place: place});
};

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid; 

    let place: Place;
    try {
        place = await AppDataSource.mongoManager.findOne(Place, {
            where: { _id: new ObjectId(placeId)},
            relations: ['creator']
        });
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not find a place', 500
        );
        return next(errorHttp);
    }

    if(!place){
        const errorHttp = new HttpError(
            'Could not find place for this id', 404
        );
        return next(errorHttp);
    }

    await AppDataSource.mongoManager.transaction(async (transactionalEntityManager) => {
        console.log('ALEJO ', place);
        let user = await transactionalEntityManager.findOneBy(User, { _id: new ObjectId(place.creator._id)});
        user.places.filter(p => p._id !== placeId)
        transactionalEntityManager.delete(Place, place);
        transactionalEntityManager.save(User, place.creator)
    }).then(() => {
        res.status(200).json({message: 'Deleted place.'});
    }).catch(onRejected => {
        const errorHttp = new HttpError(
            'Something went wrong, could not delete place ' + onRejected, 500
        );
        return next(errorHttp);
    });
};