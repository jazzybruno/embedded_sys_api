import { Entity , PrimaryGeneratedColumn , Column, ManyToOne } from "typeorm";
import { User } from "./User.model";

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    body_temperature : number;

    @Column()
    blood_pressure : number;

    @Column()
    heart_rate : number;

    @ManyToOne(User => User)
    user : User;

    @Column()
    date : Date;

    constructor(id : number , body_temperature : number , blood_pressure : number , heart_rate : number , user : User , date : Date){
        this.id = id;
        this.body_temperature = body_temperature;
        this.blood_pressure = blood_pressure;
        this.heart_rate = heart_rate;
        this.user = user;
        this.date = date;
    }
}