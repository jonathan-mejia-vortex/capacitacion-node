import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get('/', (req: Request , res: Response) => {
  res.status(200).json({message: 'Hello World!'});
});

app.listen(port, () => {
  return console.log(`Listening at http://localhost:${port}`);
});