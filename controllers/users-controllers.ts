import { HttpError } from '../models/http-error';
import { v4 as uuid } from 'uuid';
import { validationResult } from "express-validator";

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Ale',
        email: 'test@test.com',
        password: 'texters'
    }
];

export const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

export const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalidad inputs passed, please check your data.', 422);
    }
    const { name, email, password } = req.body;
    
    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser){
        throw new HttpError('Could not create user, email already exists.', 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(200).json({user: createdUser});
};

export const login = (req, res, next) => {
    const { email, password } = req.body; 

    const identifiedUser = DUMMY_USERS.find(U => U.email === email);

    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
    }

    res.json({message : 'Logged in!'});
};