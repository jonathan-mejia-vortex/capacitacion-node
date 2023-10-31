// import express, { Request, Response } from 'express';

// const app = express();
// const port = 5000;

// const placesRoutes = require('../../routes/places-routes');

// app.use('/api/places/', placesRoutes);

// app.use((error, req, res, next) => {
//   if(res.headersSent){
//       return next(error);
//   }

//   res.status(error.code || 500);
//   res.json({message: error.message || 'An unknown error ocurred!'});
// });

// app.listen(port, () => {
//   return console.log(`Listening at http://localhost:${port}`);
// });