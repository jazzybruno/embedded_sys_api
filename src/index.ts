import express , {Request , Response , Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import auth from './middlewares/middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "usersdb.sql";

app.use(express.urlencoded(),
cors({
    origin: 'localhost:3000'
}));

app.get('/get' , (req : Request , res : Response) => {
    res.send('Hello World');
})

app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
  });