import { HttpError } from '../models/http-error';
import { v4 as uuid } from 'uuid';
import { validationResult } from "express-validator";
import { getCoordsForAdress } from '../utils/location';

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'P1',
        description: 'Description',
        location: {
            lat: 1,
            lng: 1
        },
        address: 'Fake Adress 123',
        creator: 'u1'
    }
];

export const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(e => e.id === placeId);
    if(!place){
        throw new HttpError('Could not find a place for the provided id.', 404);
    } 
    res.json({place});
};

export const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if(!places || places.length === 0){
        return next(new HttpError('Could not find places for the provided user id.', 404));
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
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace});
};

export const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalidad inputs passed, please check your data.', 422);
    }
    const { title, description, coordinates, address, creator } = req.body;
    const placeId = req.params.pid; 

    const updatePlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    updatePlace.title = title;
    updatePlace.description = description;

    DUMMY_PLACES[placeIndex] = updatePlace;

    res.status(200).json({place: updatePlace});
};

export const deletePlace = (req, res, next) => {
    const placeId = req.params.pid; 
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for that id.', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: 'Deleted place.'});
};