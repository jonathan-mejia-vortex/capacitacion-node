import axios from 'axios';
import { HttpError } from '../models/http-error';

export async function getCoordsForAdress(address: string) {
    // const response = await axios.get('');
    const data = { lat: 40.75846, lng: -73.79845 }; //response.data
    if(!data 
        // || data.status === 'ZERO_RESULTS'
    ){
        const error = new HttpError(
            'Could not find location for the specified address',
            422
        );
    }
    return data;
}
