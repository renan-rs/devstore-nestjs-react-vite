import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('me (GET /auth/me)', () => {
    it('should return the profile of the authenticated user using the id from the token', async () => {
      const profile = { id: 'u1', email: 'a@a.com', name: 'A', role: 'USER' };
      mockAuthService.getProfile.mockResolvedValue(profile);

      const result = await controller.me({ user: { userId: 'u1' } });

      expect(mockAuthService.getProfile).toHaveBeenCalledWith('u1');
      expect(result).toEqual(profile);
    });
  });
});
