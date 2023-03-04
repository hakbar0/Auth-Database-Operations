import {
  Column,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsAlphanumeric } from 'class-validator';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  @Index()
  uuid: string;

  @IsAlphanumeric()
  @Column({
    name: 'username',
    comment: 'The username of the user',
    nullable: false,
    unique: true,
  })
  username: string;

  @IsEmail()
  @Column({
    name: 'email',
    comment: 'The users email.',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    comment: 'The users, encrypted password.',
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
