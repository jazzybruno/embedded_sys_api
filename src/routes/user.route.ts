import { createUser , updateUser , login , getUserByEmail , getUserById , getUsers , getAuthenticatedUser , deleteUser } from "../controller/user.controller";
import { Router } from "express";
import { Auth } from "../middlewares/middlewares";
import { check } from "express-validator";

const useRouter = Router();

useRouter.get('/all' , Auth , getUsers);

useRouter.get('/auth/user' , Auth , getAuthenticatedUser);

useRouter.get('/:id' , Auth , getUserById);

useRouter.get('/email/:email' , Auth , getUserByEmail);

useRouter.post('/create' , [
    check('email').isEmail(),
    check('username').isLength({min:5}),
    check('password').isLength({min:5})
] , createUser);

useRouter.patch('/update/:id' , Auth , [
    check('email').isEmail(),
    check('username').isLength({min:5}),
    check('password').isLength({min:5})
] , updateUser);

useRouter.delete('/delete/:id' , Auth , deleteUser);

useRouter.post('/login' , [
    check('email').isEmail(),
    check('password').isLength({min:5})
] , login);


export default useRouter;