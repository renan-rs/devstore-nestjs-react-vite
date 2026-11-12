import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService){}

    // "Eletrônicos & Games" -> "eletronicos-games"
    static slugify(name: string): string {
        return name
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async create(createCategoryDto: CreateCategoryDto){
        const name = createCategoryDto.name.trim();
        const slug = CategoriesService.slugify(name);

        if(!slug){
            throw new BadRequestException('O nome da categoria deve conter letras ou números');
        }

        const exists = await this.prisma.category.findFirst({
            where: {OR: [{name}, {slug}]},
        });

        if(exists){
            throw new ConflictException('Já existe uma categoria com esse nome');
        }

        return this.prisma.category.create({
            data: {name, slug},
        });
    }

    async findAll(){
        return this.prisma.category.findMany({
            orderBy: {name: 'asc'},
            include: {_count: {select: {products: true}}},
        });
    }

    async remove(id: string){
        const category = await this.prisma.category.findUnique({
            where: {id},
            include: {_count: {select: {products: true}}},
        });

        if(!category){
            throw new NotFoundException('Categoria não encontrada');
        }

        const productsCount = category._count.products;
        if(productsCount > 0){
            throw new ConflictException(
                `Categoria possui ${productsCount} produto(s) e não pode ser excluída`,
            );
        }

        return this.prisma.category.delete({
            where: {id},
        });
    }
}
