
import { HttpError } from '../models/http-error';
import mongoose from 'mongoose';
import { Place as IPlace } from '../interfaces/place-interface';
import { Place } from '../models/place';
import { User as IUser} from '../interfaces/user-interface';
import { User } from '../models/user';

class UserService {
    static async getUsers(): Promise<IUser[]> {
        const users = await User.find({}, '-password');
    
        if(!users || users.length === 0){
            throw new HttpError('Could not find users.', 404);
        } 
        return users.map(user => user.toObject({getters: true}));
    }

    static async signup(name: string, email: string, password: string, image: string): Promise<IUser> {
        const existingUser = await User.findOne({email: email});
    
        if(existingUser){
            throw new HttpError(
                'User exists already, please login instead.', 422
            );
        }
        const createdUser = new User({
            name,
            email,
            password,
            image,
            places: [],
        });

        await createdUser.save();

        return createdUser.toObject( { getters: true});
    }


    static async login(email: string, password: string): Promise<IUser> {
        const identifiedUser = await User.findOne({email: email});

        if(!identifiedUser || identifiedUser.password !== password){
            throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
        }
        
        return identifiedUser.toObject( { getters: true});
    }
}

export default UserService;