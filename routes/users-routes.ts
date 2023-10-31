import express, { Router }  from 'express';
import { check } from "express-validator";
import { getUsers, signup, login } from '../controllers/users-controllers';

const router: Router = express.Router();

router.get('/', getUsers);

router.post(
    '/signup', 
    [
        check("name").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({min: 6}),
    ],
    signup
);

router.post('/login', login);


export const userRoutes = router;