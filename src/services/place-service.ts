import { getPlaceById } from "../controllers/places-controllers";

interface Place {
    id: string;
    title: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    creator: string;
}

let DUMMY_PLACES: Place[] = [
    {
        id: "p1",
        title: "Buenos Aires",
        description: "Ba, capital",
        location: {
            lat: 40.7484474,
            lng: -73.9871516,
          },
          address: 'Flores, capital',
          creator: 'u1',
    },
];

class PlaceService {
    static getPlaceById(placeId: string) Place {
        const place = DUMMY_PLACES.find((p) => {
            return p.id === placeId;
        });

        if(!place) {
            throw new HttpError( "Could not find a place for the provided id", 404);
        }
        return place;
    }
}

export default PlaceService;
