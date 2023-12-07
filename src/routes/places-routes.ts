import express, { Router } from "express";
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers";
import { check } from "express-validator";
import fileUpload from "../middleware/file-upload";

const router: Router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.post(
    "/", 
    fileUpload.single('image'),
    [
        check("title").not().isEmpty(),
        check("description").isLength({min: 5}),
        check("address").not().isEmpty()
    ], 
    createPlace
);

router.patch(
    "/:pid", 
    [
        check("title").not().isEmpty(),
        check("description").isLength({min: 5}),
    ], 
    updatePlace
);

router.delete("/:pid", deletePlace);

export const placesRoutes = router;
