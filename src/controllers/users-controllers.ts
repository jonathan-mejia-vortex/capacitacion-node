import { HttpError } from '../models/http-error';
import { validationResult } from "express-validator";
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import UserService from '../services/users-services';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
        res.status(200).json({users});
    } catch (err) {
        next(err);
    };
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError('Invalidad inputs passed, please check your data.', 422));
    }
    try {
        const { name, email, password } = req.body;
        const user = await UserService.signup(name, email, password, 'image');
        res.status(200).json({user});
    } catch (err) {
        next(err);
    };
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body; 
        const user = await UserService.login(email, password);
        res.json({message : 'Logged in!', user});
    } catch (err) {
        next(err);
    };
};