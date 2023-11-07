import mongoose from "mongoose";
import { Product } from "../models/product";
import { MONGO_DB_PW } from "../utils/keys";
import { NextFunction, Request, Response } from 'express';

const url = 'mongodb+srv://alejozonta:' + MONGO_DB_PW + '@cluster0.citg00o.mongodb.net/?retryWrites=true&w=majority';

// mongoose.connect(url)
//     .then(() => {
//         console.log('Connected to database!')
//     })
//     .catch(() => {
//         console.log('Connection failed!')
//     });

export const createProduct2 = async (req: Request, res: Response, next: NextFunction) => {
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    // console.log(createdProduct);

    const result = await createdProduct.save();

    // console.log(typeof createdProduct.id);


    res.json(result);
};

export const getProducts2 = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find().exec();

    res.json(products);
};