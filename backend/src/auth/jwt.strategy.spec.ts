import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockUsersService = {
    findByid: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    strategy = new JwtStrategy(mockUsersService as unknown as UsersService);
  });

  it('should return the current user data from the database when the user exists', async () => {
    // role no banco (ADMIN) difere do role "antigo" do token (USER)
    mockUsersService.findByid.mockResolvedValue({
      id: '1',
      email: 'admin@devstore.com',
      role: 'ADMIN',
    });

    const result = await strategy.validate({ sub: '1', email: 'old@mail.com', role: 'USER' });

    expect(mockUsersService.findByid).toHaveBeenCalledWith('1');
    expect(result).toEqual({ userId: '1', email: 'admin@devstore.com', role: 'ADMIN' });
  });

  it('should throw UnauthorizedException when the user no longer exists', async () => {
    mockUsersService.findByid.mockRejectedValue(new NotFoundException());

    await expect(
      strategy.validate({ sub: 'deleted-id', email: 'ghost@mail.com', role: 'USER' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should rethrow unexpected errors', async () => {
    mockUsersService.findByid.mockRejectedValue(new Error('db down'));

    await expect(
      strategy.validate({ sub: '1', email: 'a@b.com', role: 'USER' }),
    ).rejects.toThrow('db down');
  });
});
