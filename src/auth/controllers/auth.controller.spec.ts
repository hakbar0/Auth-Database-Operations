import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { BadRequestException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../entities/entities';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: '',
          entities: entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(entities),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerUserDto = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'p@ssw0rd',
    };

    it('should create a new user', async () => {
      const { password: _password, ...newUser } = registerUserDto;
      jest.spyOn(authService, 'createUser').mockResolvedValue(newUser);

      const result = await controller.register(registerUserDto);

      expect(result).toEqual({
        username: 'testuser',
        email: 'testuser@example.com',
      });
    });

    it('should throw an error if the user already exists', async () => {
      jest.spyOn(authService, 'createUser').mockImplementation(() => {
        throw new BadRequestException('Username or email already exists');
      });

      await expect(controller.register(registerUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
