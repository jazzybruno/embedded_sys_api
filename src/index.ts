import express , {Request , Response , Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from './models/User.model';
import { createConnection , getConnection } from 'typeorm';
import 'reflect-metadata'
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "usersdb.sql";

app.use(express.urlencoded(),
cors({
    origin: 'localhost:3000'
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// the user functions : 
app.post('/user/register' , async (req : Request , res : Response) => {
    const {email , username , password} = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

    const hashedPassword = await bcrypt.hash(password , 10);

    const userRepository = getConnection().getRepository(User);
    const existingUser = await userRepository.findOne({
        where:{
            email : email
        }
    })

    if(existingUser){
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User(email , username , hashedPassword);
    
    await userRepository.save(user);
    return res.status(201).json({ message: 'User registered successfully' });

});

app.post('/user/login' , async (req : Request , res : Response) => {
    const {email , password} = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOne({
        where:{
            email : email
        }
    })

    if(!user){
        return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({
        userId : user.id,
        username : user.username,
        email : user.email
    } , process.env.TOKEN_KEY||'secret that can come in backeup just in case' , {expiresIn : '1h'});

    return res.status(200).json({ message: 'Logged in successfully' , token : token });
});


app.get('/user/all' , async (req : Request , res : Response) => {
    const userRepository = getConnection().getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json({ message: 'Users fetched successfully' , users : users });
})

app.get('/user/:id' , async (req : Request , res : Response) => {
    const userRepository = getConnection().getRepository(User);
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await userRepository.findOne({
        where:{
            id : parseInt(id)
        }
    });
    return res.status(200).json({ message: 'User fetched successfully' , user : user });
})

app.put('/user/:id' , async (req : Request , res : Response) => {
    const {email , username , password} = req.body;
    const userRepository = getConnection().getRepository(User);
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await userRepository.findOne({
        where:{
            id : parseInt(id)
        }
    })

    if(!user){
        return res.status(400).json({ message: 'User does not exist' });
    }

    user.email = email;
    user.username = username;
    user.password = password;
    await userRepository.save(user);
    return res.status(200).json({ message: 'User updated successfully' , user : user });
});


app.delete('/user/:id' , async (req : Request , res : Response) => {
    const userRepository = getConnection().getRepository(User);
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await userRepository.findOne({
        where:{
            id : parseInt(id)
        }
    })

    if(!user){
        return res.status(400).json({ message: 'User does not exist' });
    }

    await userRepository.remove(user);
    return res.status(200).json({ message: 'User deleted successfully' });
})

app.get('/' , (req : Request , res : Response) => {
    res.send('<h1>Welcome to the IOT PROJECT API</h1>');
})

createConnection().then(()=>{
    app.listen(PORT, ():void => {
        console.log(`Server Running here 👉 https://localhost:${PORT}`);
      });
}).catch((error)=>{
    console.log(error);
})