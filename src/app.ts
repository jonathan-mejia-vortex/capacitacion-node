import express from 'express';
import bodyParser from 'body-parser';
import * as placesRoutes from './routes/places-routes';
import * as usersRoutes from './routes/users-routes';
import { HttpError } from './models/http-error';

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes.default); // => /api/places...
app.use('/api/users', usersRoutes.default);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  next(error);
});

app.use((error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(5000);
