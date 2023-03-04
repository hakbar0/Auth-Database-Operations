import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Hashes the provided password using a randomly generated salt.
   * @param password The plaintext password to hash.
   * @returns A Promise that resolves to the hashed password.
   */
  async createPasswordHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  /**
   * Creates a new user with the provided username, email, and password.
   * Throws a BadRequestException if a user with the same username or email already exists.
   * @param username The username of the new user.
   * @param email The email address of the new user.
   * @param password The plaintext password of the new user.
   * @returns A Promise that resolves to the newly created User entity.
   */
  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<Partial<User>> {
    const userExists = await this.emailOrUsernameExist(username, email);
    if (userExists) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await this.createPasswordHash(password);

    const newUser = await this.userRepository.save({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _password, id: _id, ...user } = newUser;
    return user;
  }

  /**
   * Checks if a user with the provided username or email already exists in the database.
   * @param username The username to check.
   * @param email The email address to check.
   * @returns A Promise that resolves to a boolean indicating whether the user exists.
   */
  async emailOrUsernameExist(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    return !!user;
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  /**
   * Attempts to log in a user with the provided username and password.
   * Throws a BadRequestException if the provided credentials are invalid.
   * @param username The username of the user to log in.
   * @param password The plaintext password of the user to log in.
   * @returns A Promise that resolves to a success message if the login was successful.
   */
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Invalid username or password');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException();
    }

    return user;
  }

  async login(username: string, uuid: string) {
    const payload = { username, uuid };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
