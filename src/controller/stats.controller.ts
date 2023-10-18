import { Request, Response } from 'express';
import {Stats} from '../models/stats.model';
import { createConnection, getConnection, getRepository } from 'typeorm';

export const createStats = async(req : Request , res : Response) => {
  const { body_temperature , blood_pressure , heart_rate, } = req.body;
  if(!body_temperature || !blood_pressure || !heart_rate){
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const user = req.body.user;
  if(!user){
    return res.status(400).json({ message: 'Missing required fields' });
    }
    const statsRepository = getConnection().getRepository(Stats);
    const statsNumber = await statsRepository.count();
    let id : number = statsNumber + 1;
    const date = new Date();
    const stats = new Stats(id , body_temperature , blood_pressure , heart_rate , user , date);
    
    statsRepository.save(stats);
    return res.status(201).json({ message: 'Stats created successfully' , data : stats });
}

export const getAllStats = ( req : Request ,res: Response ) => {
   const statsRepository = getConnection().getRepository(Stats);
    const stats = statsRepository.find();
    return res.status(200).json({ message: 'Stats fetched successfully' , data : stats });
}

export const getStatsById = (req : Request , res : Response) => {
   const statsRepository = getConnection().getRepository(Stats);
    const id = req.params.id;
    if(!id){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const stats = statsRepository.findOne({
        where:{
            id : parseInt(id)
        }
    });
    return res.status(200).json({ message: 'Stats fetched successfully' , data : stats });
}

export const getStatsByUserId = (req : Request , res: Response) => {
  const statsRepository = getConnection().getRepository(Stats);
    const user = req.body.user;
    if(!user){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const stats = statsRepository.findOne({
        where:{
            user : user
        }
    });
    return res.status(200).json({ message: 'Stats fetched successfully' , data : stats });
}

export const updateStats = async( req : Request ,  res : Response) => {
    const { body_temperature , blood_pressure , heart_rate, date } = req.body;
    if(!body_temperature || !blood_pressure || !heart_rate || !date){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const user = req.body.user;
    if(!user){
        return res.status(400).json({ message: 'Missing required fields' });
        }

        const statId = req.params.id;
        if(!statId){
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const statsRepository = getConnection().getRepository(Stats);
        const statToUpdate = await statsRepository.findOne({
            where:{
                id : parseInt(statId)
            }
        });

        if(!statToUpdate){
            return res.status(400).json({ message: 'Stats does not exist' });
        }

        statToUpdate.body_temperature = body_temperature;
        statToUpdate.blood_pressure = blood_pressure;
        statToUpdate.heart_rate = heart_rate;
        statToUpdate.date = date;

        statsRepository.save(statToUpdate);
        return res.status(201).json({ message: 'Stats updated successfully' , data : statToUpdate });
}

export const deleteStats = async(req : Request , res : Response) => {
    const statsId = req.params.id;
    const statsRespository = getConnection().getRepository(Stats);
    const stats = await statsRespository.findOne({
        where:{
            id : parseInt(statsId)
        }
    });
    if(!stats){
        return res.status(400).json({ message: 'Stats does not exist' });
    }

    statsRespository.remove(stats);
    return res.status(200).json({ message: 'Stats deleted successfully' });
}