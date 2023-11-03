import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import { HttpError } from '../src/utils/http-error';
import { validationResult } from "express-validator";


export const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await AppDataSource.mongoManager.find(User);
    } catch (error) {
        const errorHttp = new HttpError(
            'Fetching users failed, please try again later', 500
        );
        return next(errorHttp);
    }

    if(!users || users.length === 0){
        const errorHttp = new HttpError('Could not find users.', 404);
        return next(errorHttp);
    } 
    res.json({users});
};

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    const { name, email, password } = req.body;
    
    let existingUser;
    try {
        existingUser = await AppDataSource.mongoManager.findOneBy(User, { email: email});
    } catch (error) {
        const errorHttp = new HttpError(
            'Signning up failed, please try again later' + error, 500
        );
        return next(errorHttp);
    }
    if(existingUser){
        const errorHttp = new HttpError(
            'User exists already, please login instead.', 422
        );
        return next(errorHttp);
    }

    const createdUser = new User();   
    createdUser.name = name;
    createdUser.email = email;
    createdUser.password = password;
    createdUser.image = 'image';

    try {
        await AppDataSource.mongoManager.save(createdUser);
    } catch (error) {
        const errorHttp = new HttpError(
            'Signing up failed, please try again' + error, 500
        );
        return next(errorHttp);
    }

    res.status(200).json({createdUser});
};
export const login = async (req, res, next) => {

    const { email, password } = req.body; 

    let identifiedUser;
    try {
        identifiedUser = await AppDataSource.mongoManager.findOneBy(User, {email: email});
    } catch (error) {
        const errorHttp = new HttpError(
            'Logging up failed, please try again later', 500
        );
        return next(errorHttp);
    }

    if(!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError('Could not identify user, credentials seem to be wrong', 401));
    }

    res.json({message : 'Logged in!'});
};