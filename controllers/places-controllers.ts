import { HttpError } from '../models/http-error';
import { validationResult } from "express-validator";
import { getCoordsForAdress } from '../utils/location';
import { Place } from '../models/place';
import { User } from '../models/user';
import mongoose from 'mongoose';

export const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
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
    res.json({place: place.toObject( { getters: true})});
};

// An alternative
// export const getPlacesByUserId = async (req, res, next) => {
//     const userId = req.params.uid;

//     let places;
//     try {
//         places = await Place.find({ creator: userId});
//     } catch (error) {
//         const errorHttp = new HttpError(
//             'Fetching places failed, please try again later', 500
//         );
//         return next(errorHttp);
//     }

//     if(!places || places.length === 0){
//         const errorHttp = new HttpError('Could not find places for the provided user id.', 404);
//         return next(errorHttp);
//     } 

//     res.json({places: places.map(place => place.toObject({getters: true}))});
// };


export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (error) {
        const errorHttp = new HttpError(
            'Fetching places failed, please try again later', 500
        );
        return next(errorHttp);
    }

    if(!userWithPlaces || userWithPlaces.places.length === 0){
        const errorHttp = new HttpError('Could not find places for the provided user id.', 404);
        return next(errorHttp);
    } 

    res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))});
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

    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        creator,
        image: "image",
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        const errorHttp = new HttpError(
            'Creating place failed, please try again', 500
        );
        return next(errorHttp);
    }

    if(!user){
        const errorHttp = new HttpError(
            'Could not find user for the provided id', 404
        );
        return next(errorHttp);
    }

    console.log("User creating Place: ", user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (error) {
        const errorHttp = new HttpError(
            'Creating place failed, please try again', 500
        );
        return next(errorHttp);
    }
    res.status(201).json({place: createdPlace.toObject( { getters: true})});
};

export const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    const { title, description } = req.body;
    const placeId = req.params.pid; 


    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not find a place', 500
        );
        return next(errorHttp);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not updete place.', 500
        );
        return next(errorHttp);
    }
    res.status(200).json({place: place.toObject({getters: true})});
};

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid; 

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await Place.deleteOne(place, { session: sess});
        place.creator.places.pull(place);
        await  place.creator.save({ session: sess});

        await sess.commitTransaction();
    } catch (error) {
        const errorHttp = new HttpError(
            'Something went wrong, could not delete place' + error, 500
        );
        return next(errorHttp);
    }

    res.status(200).json({message: 'Deleted place.'});
};