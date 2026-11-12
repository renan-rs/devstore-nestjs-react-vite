import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockPrisma = {
    category: { findUnique: jest.fn() },
    product: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
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

  describe('update', () => {
    it('should update only the provided fields and include the category', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', ...dto });
      mockPrisma.product.update.mockResolvedValue({ id: 'p1', ...dto, price: 79.9 });

      await service.update('p1', { price: 79.9 });

      expect(mockPrisma.category.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { price: 79.9 },
        include: { category: true },
      });
    });

    it('should validate the new category when categoryId is provided', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', ...dto });
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-2', name: 'Livros', slug: 'livros' });
      mockPrisma.product.update.mockResolvedValue({ id: 'p1', ...dto, categoryId: 'cat-2' });

      await service.update('p1', { categoryId: 'cat-2' });

      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 'cat-2' } });
      expect(mockPrisma.product.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when the product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { name: 'Novo nome' })).rejects.toThrow(NotFoundException);
      expect(mockPrisma.product.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when the new category does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', ...dto });
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.update('p1', { categoryId: 'cat-x' })).rejects.toThrow(BadRequestException);
      expect(mockPrisma.product.update).not.toHaveBeenCalled();
    });
  });
});
