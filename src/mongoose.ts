import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from './models/product';

mongoose
  .connect(
    'mongodb+srv://manu:KyOP1JrHoErqQILt@cluster0-g8eu9.mongodb.net/products_test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((error) => {
    console.error('Connection failed!', error);
  });

const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const productData: IProduct = {
    name: req.body.name,
    price: req.body.price,
  };

  try {
    const createdProduct = new Product(productData);
    const result = await createdProduct.save();
    console.log(typeof createdProduct._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find().exec();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export { createProduct, getProducts };
