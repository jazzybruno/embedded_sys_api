import express , {Request , Response , Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models/User.model';
import { createConnection , getConnection } from 'typeorm';
import 'reflect-metadata'
import bodyParser from 'body-parser';
import useRouter from './routes/user.route';
import statsRouter from './routes/stats.route';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "usersdb.sql";

app.use(express.urlencoded(),
cors({
    origin: 'localhost:3000'
}))

// The views Rendering Engine
const publicDir = path.join(__dirname, '../public');

app.use(express.static(publicDir));

// the views routes 
app.get('/dashboard' ,  (req , res) => {
    res.render('index')
})

app.get('/login' , (req , res)=>{
    res.render('login')
})

app.get('/register' , (req , res)=>{
    res.render('register')
})


app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/user' , useRouter);
app.use('/api/stats' , statsRouter)

app.get('/' , (req : Request , res : Response) => {
    res.send('<h1>IOT PROJECT API is online</h1>');
})

createConnection().then(()=>{
    app.listen(PORT, ():void => {
        console.log(`Server Running here 👉 https://localhost:${PORT}`);
      });
}).catch((error)=>{
    console.log(error);
})