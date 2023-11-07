import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { HttpError } from "../utils/http-error";
import { User as IUser } from "../interfaces/user-interface";

class UserService {
    static async getUsers(): Promise<IUser[]> {
        const users = await AppDataSource.mongoManager.find(User);
    
        if(!users || users.length === 0){
            throw new HttpError('Could not find users.', 404);
        } 

        return users;
    }

    static async signup(name: string, email: string, password: string, image: string): Promise<IUser> {
        const existingUser = await AppDataSource.mongoManager.findOneBy(User, { email: email});
    
        if(existingUser){
            throw new HttpError(
                'User exists already, please login instead.', 422
            );
        }
        const createdUser = new User();   
        createdUser.name = name;
        createdUser.email = email;
        createdUser.password = password;
        createdUser.image = 'image';

        await AppDataSource.mongoManager.save(createdUser);

        return createdUser;
    }

    static async login(email: string, password: string): Promise<IUser> {
        const identifiedUser = await AppDataSource.mongoManager.findOneBy(User, {email: email});

        if(!identifiedUser || identifiedUser.password !== password){
            throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
        }
        
        return identifiedUser;
    }
}

export default UserService;
