// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  constructor(id : number , email: string, username: string, password: string) {
    super();
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
