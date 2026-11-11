import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findByid: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {provide: UsersService, useValue: mockUsersService},
        {provide: JwtService, useValue: mockJwtService},
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token and user info when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      const result = await service.login({ email: 'test@example.com', password: 'password123' });
      expect(result.access_token).toBe('mock_jwt_token');
      expect(result.user).toEqual(expect.objectContaining({ email: mockUser.email }));
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException on login when password does not match', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return the current user from the database (without password)', async () => {
      const profile = { id: '1', email: 'test@example.com', name: 'Test User', role: 'ADMIN' };
      mockUsersService.findByid.mockResolvedValue(profile);

      const result = await service.getProfile('1');

      expect(mockUsersService.findByid).toHaveBeenCalledWith('1');
      expect(result).toEqual(profile);
      expect(result).not.toHaveProperty('password');
    });

    it('should propagate the error when the user no longer exists', async () => {
      mockUsersService.findByid.mockRejectedValue(new NotFoundException());

      await expect(service.getProfile('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
