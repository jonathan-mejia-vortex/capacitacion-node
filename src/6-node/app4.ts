import { NextFunction, Request, Response } from 'express';

const ex = require('express');
const bodyParser = require('body-parser');
const appEx = ex();

appEx.use(bodyParser.urlencoded({ extended: false }));

appEx.post('/user', (req: Request, res: Response, next: NextFunction) => {
    res.send('<h1> User: ' + req.body.userName + '</h1>');
});

appEx.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('<form action="/user" method="POST"><input type="text" name="userName"><button type="submit"> Create User</button></form>')
});

appEx.listen(5000);