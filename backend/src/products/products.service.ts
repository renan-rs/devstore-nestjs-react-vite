import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService){}

    async create(createProductDto: CreateProductDto){
        const category = await this.prisma.category.findUnique({
            where: {id: createProductDto.categoryId},
        });

        if(!category){
            throw new BadRequestException('Categoria não encontrada');
        }

        return this.prisma.product.create({
            data: createProductDto,
            include: {category: true},
        });
    }

    async findAll(){
        return this.prisma.product.findMany({
            include: {category: true},
        });
    }

    async findOne(id: string){
        const product = await this.prisma.product.findUnique({
            where: {id},
            include: {category: true},
        });

        if(!product){
            throw new NotFoundException('Produto não encontrado');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto){
        await this.findOne(id); // Garante que existe antes de atualizar

        if(updateProductDto.categoryId){
            const category = await this.prisma.category.findUnique({
                where: {id: updateProductDto.categoryId},
            });

            if(!category){
                throw new BadRequestException('Categoria não encontrada');
            }
        }

        return this.prisma.product.update({
            where: {id},
            data: updateProductDto,
            include: {category: true},
        });
    }

    async remove(id: string){
        await this.findOne(id); // Garante que existe antes de deletar
        return this.prisma.product.delete({
            where: {id},
        });
    }
}
