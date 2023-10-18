import { Router } from "express";
import { Auth } from "../middlewares/middlewares";
import { check } from "express-validator";
import { createStats , getAllStats , getStatsById , getStatsByUserId , updateStats , deleteStats } from "../controller/stats.controller";

const statsRouter = Router();

statsRouter.get('/all' , Auth , getAllStats);

statsRouter.get('/id/:id' , Auth , getStatsById);

statsRouter.get('/user' , Auth , getStatsByUserId);

statsRouter.post('/create' , Auth , [
    check('body_temperature').isNumeric(),
    check('blood_pressure').isNumeric(),
    check('heart_rate').isNumeric(),
] , createStats);

statsRouter.put('update/:id' , Auth , [
    check('body_temperature').isNumeric(),
    check('blood_pressure').isNumeric(),
    check('heart_rate').isNumeric(),
] , updateStats);

statsRouter.delete('delete/:id' , Auth , deleteStats);

export default statsRouter;