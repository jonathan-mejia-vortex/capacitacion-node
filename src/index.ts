import express, { Request, Response } from 'express';
import { HttpError } from './utils/http-error';
import bodyParser from 'body-parser';
import { userRoutes } from '../routes/users-routes';
import { placesRoutes } from '../routes/places-routes';
import { AppDataSource } from './data-source';
import "reflect-metadata";

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/', (req: Request , res: Response) => {
  res.status(200).json({message: 'Hello World!'});
});

app.use('/api/places/', placesRoutes);
app.use('/api/users/', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
  if(res.headersSent){
      return next(error);
  }

  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error ocurred!'});
});

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        app.listen(port, () => {
          return console.log(`Listening at http://localhost:${port}`);
        });
    })
    .catch((error) => console.log(error))




