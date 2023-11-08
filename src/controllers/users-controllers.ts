import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HttpError from '../models/http-error';

const DUMMY_USERS: User[] = [
  {
    id: 'u1',
    name: 'Naho Carmona',
    email: 'naho@test.com',
    password: 'nahotest',
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const getUsers = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.json({ users: DUMMY_USERS });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

const signup = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find((u) => u.email === email);
    if (hasUser) {
      throw new HttpError('Could not create user, email already exists.', 422);
    }

    const createdUser: User = {
      id: uuid(),
      name,
      email,
      password,
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
  } catch (error) {
    next(error); 
  }
};

const login = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }

    res.json({ message: 'Logged in!' });
  } catch (error) {
    next(error); 
  }
};

export { getUsers, signup, login };
