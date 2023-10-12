import { createUser , updateUser , login , getUserByEmail , getUserById , getUsers , getAuthenticatedUser , deleteUser } from "../controller/user.controller";
import { Router } from "express";
import { Auth } from "../middlewares/middlewares";
import { check } from "express-validator";

const useRouter = Router();

useRouter.get('/all' , Auth , getUsers);

useRouter.get('/auth/user' , Auth , getAuthenticatedUser);

useRouter.get('/:id' , Auth , getUserById);

useRouter.get('/email/:email' , getUserByEmail);

useRouter.post('/' , [
    check('email').isEmail(),
    check('username').isLength({min:5}),
    check('password').isLength({min:5})
] , createUser);

useRouter.put('/:id' , Auth , [
    check('email').isEmail(),
    check('username').isLength({min:5}),
    check('password').isLength({min:5})
] , updateUser);

useRouter.delete('/:id' , Auth , deleteUser);

useRouter.post('/login' , [
    check('email').isEmail(),
    check('password').isLength({min:5})
] , login);


export default useRouter;