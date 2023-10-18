import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { createConnection , getConnection } from 'typeorm';
import 'reflect-metadata'
import { Response , Request } from 'express';
import { parse } from 'path';

export const createUser = async (req: Request, res: Response) => {
    const {email , username , password} = req.body;

    if (!email || !username || !password) {
        return res.render('register' , {
            message : 'Missing required fields'
        } )
        // return res.status(400).json({ message: 'Missing required fields' });
      }

    const hashedPassword = await bcrypt.hash(password , 10);

    const userRepository = getConnection().getRepository(User);
    const existingUser = await userRepository.findOne({
        where:{
            email : email
        }
    })

    if(existingUser){
        return res.render('register' , {
            message : 'User Already Exists'
        } )
        // return res.status(400).json({ message: 'User already exists' });
    }
    const usersNumber = await userRepository.count();
    let id : number = usersNumber + 1;
    const user = new User(id , email , username , hashedPassword);
    
    await userRepository.save(user);
    return res.render('register' , {
        success : 'User registered successfully'
    } )
    // return res.status(201).json({ message: 'User registered successfully' });

};

export const getUserById = async (req: Request, res: Response) => {
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
};

export const getUsers = async (req: Request, res: Response) => {
    const userRepository = getConnection().getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json({ message: 'Users fetched successfully' , users : users });

}

export const getUserByEmail = async (req: Request, res: Response) => {
    const email = req.params.email;
    const userInside = req.body.user;
    if(!email){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if(userInside.email !== email){
        return res.status(400).json({ message: 'You are not authorized to get this user' });
    }
    
    const userRepository = getConnection().getRepository(User);
    const user = await userRepository.findOne({
        where:{
            email : email
        }
    });
    return res.status(200).json({ message: 'User fetched successfully' , user : user });
}

export const updateUser = async (req: Request, res: Response) => {
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
};

export const deleteUser = async (req: Request, res: Response) => {
    const userInside = req.body.user;
    const userRepository = getConnection().getRepository(User);
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if(userInside.userId !== parseInt(id)){
        return res.status(400).json({ message: 'You are not authorized to delete this user' });
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
};

// Authentication controllers 
export const login = async (req: Request, res: Response) => {
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
        return res.render('login' , {
            message : 'Incorrect email or password'
        } )
        // res.status(400).json({ message: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.render('login' , {
            message : 'Incorrect email or password'
        } )
        // return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({
        userId : user.id,
        username : user.username,
        email : user.email
    } , process.env.TOKEN_KEY||'secret that can come in backeup just in case' , {expiresIn : '1h'});

    return res.render('login' , {
        success : 'Logged in successfully'
    } )
    // return res.status(200).json({ message: 'Logged in successfully' , token : token });

}

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    const user = req.body.user;
    return res.status(200).json({ message: 'User fetched successfully' , user : user });
};