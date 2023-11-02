import { MongoClient } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

const url =
  'mongodb+srv://manu:KyOP1JrHoErqQILt@cluster0-g8eu9.mongodb.net/products_test?retryWrites=true&w=majority';

const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price
  };

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('products').insertOne(newProduct);
  } catch (error) {
    return res.json({ message: 'Could not store data.' });
  } finally {
    client.close();
  }

  res.json(newProduct);
};

const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const client = new MongoClient(url);

  let products;

  try {
    await client.connect();
    const db = client.db();
    products = await db.collection('products').find().toArray();
  } catch (error) {
    return res.json({ message: 'Could not retrieve products.' });
  } finally {
    client.close();
  }

  res.json(products);
};

export { createProduct, getProducts };
