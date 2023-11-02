import { MongoClient } from "mongodb";
import { MONGO_DB_PW } from "../../utils/keys";

const url = 'mongodb+srv://alejozonta:' + MONGO_DB_PW + '@cluster0.citg00o.mongodb.net/?retryWrites=true&w=majority';
const PRODUCT_COLLECTION_NAME = 'products';

export const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db();
        const result = await db.collection(PRODUCT_COLLECTION_NAME).insertOne(newProduct);
    } catch (error) {
        return res.json({message: 'Could not store data: ' + error});
    } finally {
        client.close(false);
    };
    res.json({newProduct});
};

export const getProducts = async (req, res, next) => {
    const client = new MongoClient(url);
    let products;
    try {
        await client.connect();
        const db = client.db();
        products = await db.collection(PRODUCT_COLLECTION_NAME).find().toArray();
    } catch (error) {
        return res.json({message: 'Could not get data: ' + error});
    } finally {
        client.close(false);
    };
    res.json({products});
};
