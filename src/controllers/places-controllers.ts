import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import PlaceService from '../services/place-service';
import HttpError from '../models/http-error';
import getCoordsForAddress from '../util/location';
import Place from '../models/place';

let DUMMY_PLACES: Place[] = [
  {
    id: 'p1',
    title: 'Buenos Aires',
    description: 'Ba, capital',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: 'Flores, capital',
    creator: 'u1',
  },
];

interface Place {
  id: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  address: string;
  creator: string;
  image: string;
}

const getPlaceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const placeId = req.params.pid;
    const place = await PlaceService.getPlaceById(placeId);
    
    if (!place) {
      throw new HttpError('Place not found', 404);
    }

    res.json({ place });
  } catch (error) {
    next(error);
  }
};


const getPlacesByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter((p) => p.creator === userId);

    if (!places || places.length === 0) {
      throw new HttpError('Could not find places for the provided user id.', 404);
    }

    res.json({ places });
  } catch (error) {
    next(error);
  }
};

const createPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { title, description, address, creator } = req.body;

    let coordinates: { lat: number; lng: number };
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      throw error;
    }

    const createdPlace: Place = {
      title,
      description,
      address,
      location: coordinates,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
      creator,
      id: uuid(),
    };

    try {
      DUMMY_PLACES.push(createdPlace);
    } catch (err) {
      throw new HttpError('Creating place failed, please try again.', 500);
    }

    res.status(201).json({ place: createdPlace });
  } catch (error) {
    next(error);
  }
};

const updatePlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
  } catch (error) {
    next(error);
  }
};

const deletePlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const placeId = req.params.pid;
    const index = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    if (index === -1) {
      throw new HttpError('Could not find a place for that id.', 404);
    }
    DUMMY_PLACES.splice(index, 1);
    res.status(200).json({ message: 'Deleted place.' });
  } catch (error) {
    next(error);
  }
};

export { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };
