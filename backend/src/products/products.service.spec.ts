import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrisma = {
    category: { findUnique: jest.fn() },
    product: { create: jest.fn() },
  };

  const dto = {
    name: 'Mouse',
    description: 'Mouse gamer',
    price: 99.9,
    stock: 5,
    imageUrl: 'https://example.com/mouse.png',
    categoryId: 'cat-1',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create the product including its category when the category exists', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Gamer', slug: 'gamer' });
      mockPrisma.product.create.mockResolvedValue({ id: 'p1', ...dto });

      await service.create(dto);

      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: dto,
        include: { category: true },
      });
    });

    it('should throw BadRequestException when the category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(mockPrisma.product.create).not.toHaveBeenCalled();
    });
  });
});
