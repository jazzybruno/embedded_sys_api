// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  constructor(email: string, username: string, password: string) {
    super();
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
