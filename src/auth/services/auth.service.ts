import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPasswordHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    //hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join the hashed result and the salt together
    const hashPass = salt + '.' + hash.toString('hex');
    return hashPass;
  }

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const userExists = await this.emailOrUsernameExist(username, email);
    if (userExists) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashPass = await this.createPasswordHash(password);

    const user = await this.userRepository.save({
      username,
      email,
      password: hashPass,
    });
    return user;
  }

  async emailOrUsernameExist(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    return !!user;
  }
}
