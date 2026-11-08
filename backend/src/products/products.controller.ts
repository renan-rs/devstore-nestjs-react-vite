import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    // Rota pública: qualquer um pode listar produtos
    @Get()
    findAll(){
        return this.productsService.findAll();
    }

    // Rota pública: ver detalhes de um produto
    @Get(':id')
    findOne(@Param('id') id: string){
        return this.productsService.findOne(id);
    }

    // Rota restrita: apenas ADMIN pode criar produtos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createProductDto: CreateProductDto){
        return this.productsService.create(createProductDto);
    }

    // Rota restrita: apenas ADMIN pode remover produtos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param(':id') id: string){
        return this.productsService.remove(id);
    }
}
