import { HttpError } from "../../models/http-error";
import { Place } from "../../models/place";
import { Place as IPlace} from '../interfaces/place.interface';

class PlaceService {
  static async getPlaceById(placeId: string): Promise<IPlace> {
    const place = await Place.findById(placeId);
    if (!place) throw new HttpError("Place not found", 404);
    return place.toObject({ getters: true });
  }
}

export default PlaceService;
