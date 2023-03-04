import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  async createPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    //hash the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join the hashed result and the salt together
    const hashPass = salt + '.' + hash.toString('hex');
    return hashPass;
  }
}
