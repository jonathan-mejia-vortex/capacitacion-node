import { HttpError } from '../models/http-error';
import { validationResult } from "express-validator";
import { getCoordsForAdress } from '../utils/location';
import { Place } from '../models/place';
import { Place as IPlace } from '../interfaces/place-interface';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import PlaceService from '../services/places-services';

export const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const placeId: string = req.params.pid;
        const place = await PlaceService.getPlaceById(placeId);
        res.status(200).json({place});
    } catch (err) {
        next(err);
    };
};

export const getPlacesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.params.uid;
        const places = await PlaceService.getPlacesByUserId(userId);
        res.status(200).json({places});
    } catch (err) {
        next(err);
    };
};


export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    try {
        const { title, description, address, creator } = req.body;
        const coordinates = await getCoordsForAdress(address);

        const place = await PlaceService.createPlace(
            title,
            description,
            "image",
            address,
            coordinates,
            creator
        );
        res.status(200).json({place});
    } catch (err) {
        next(err);
    };
};

export const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    try {
        const { title, description } = req.body;
        const placeId = req.params.pid; 

        const place = await PlaceService.updatePlace(
            placeId,
            title,
            description
        );
        res.status(200).json({place});
    } catch (err) {
        next(err);
    };
};

export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const placeId = req.params.pid; 
        const place = await PlaceService.deletePlace(placeId);
        if(place){
            res.status(200).json({message: 'Deleted place.'});
        } else {
            throw new HttpError(
                'An error ocurred deleting the place', 404
            );
        }
    } catch (err) {
        next(err);
    };
};