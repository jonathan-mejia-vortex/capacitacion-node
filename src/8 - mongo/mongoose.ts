import mongoose from "mongoose";
import { Product } from "../../models/product";
import { MONGO_DB_PW } from "../../utils/keys";

const url = 'mongodb+srv://alejozonta:' + MONGO_DB_PW + '@cluster0.citg00o.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url)
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!')
    });

export const createProduct2 = async (req, res, next) => {
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    // console.log(createdProduct);

    const result = await createdProduct.save();

    // console.log(typeof createdProduct.id);


    res.json(result);
};

export const getProducts2 = async (req, res, next) => {
    const products = await Product.find().exec();

    res.json(products);
};