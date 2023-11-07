import express, { Router } from "express";
import { createProduct, getProducts } from "../8 - mongo/mongo";
import { createProduct2, getProducts2 } from "../8 - mongo/mongoose";

const router: Router = express.Router();

router.post('/products', createProduct);

router.get('/products', getProducts);

router.post('/products2', createProduct2);

router.get('/products2', getProducts2);

export const productsRoutes = router;