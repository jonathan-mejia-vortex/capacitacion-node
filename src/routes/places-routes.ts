import express from 'express';
import { check } from 'express-validator';
import * as placesControllers from '../controllers/places-controllers';

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  [
    check('title').notEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

export default router;
