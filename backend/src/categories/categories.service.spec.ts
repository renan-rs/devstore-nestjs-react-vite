import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockPrisma = {
    category: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('slugify', () => {
    it('should remove accents, lowercase and replace separators with hyphens', () => {
      expect(CategoriesService.slugify('Eletrônicos & Games')).toBe('eletronicos-games');
      expect(CategoriesService.slugify('  Café   da Manhã ')).toBe('cafe-da-manha');
    });

    it('should return an empty string when there are no letters or numbers', () => {
      expect(CategoriesService.slugify('!!!')).toBe('');
    });
  });

  describe('create', () => {
    it('should trim the name, generate the slug and create the category', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue({ id: '1', name: 'Periféricos', slug: 'perifericos' });

      const result = await service.create({ name: '  Periféricos ' });

      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: { name: 'Periféricos', slug: 'perifericos' },
      });
      expect(result.slug).toBe('perifericos');
    });

    it('should throw ConflictException when the name or slug already exists', async () => {
      mockPrisma.category.findFirst.mockResolvedValue({ id: '1', name: 'Café', slug: 'cafe' });

      await expect(service.create({ name: 'Cafe' })).rejects.toThrow(ConflictException);
      expect(mockPrisma.category.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when the name has no letters or numbers', async () => {
      await expect(service.create({ name: '!!!' })).rejects.toThrow(BadRequestException);
      expect(mockPrisma.category.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should list categories ordered by name with the products count', async () => {
      mockPrisma.category.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } },
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when the category does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
      expect(mockPrisma.category.delete).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when the category has products', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: '1', _count: { products: 3 } });

      await expect(service.remove('1')).rejects.toThrow(ConflictException);
      expect(mockPrisma.category.delete).not.toHaveBeenCalled();
    });

    it('should delete the category when it has no products', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: '1', _count: { products: 0 } });
      mockPrisma.category.delete.mockResolvedValue({ id: '1' });

      await service.remove('1');

      expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
