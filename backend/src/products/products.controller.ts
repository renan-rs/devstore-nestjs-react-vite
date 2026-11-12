import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProductResponseDto, ProductWithCategoryResponseDto } from './dto/product-response.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}

    // Rota pública: qualquer um pode listar produtos
    @ApiOkResponse({ type: [ProductWithCategoryResponseDto] })
    @Get()
    findAll(){
        return this.productsService.findAll();
    }

    // Rota pública: ver detalhes de um produto
    @ApiOkResponse({ type: ProductWithCategoryResponseDto })
    @ApiNotFoundResponse({ description: 'Produto não encontrado' })
    @Get(':id')
    findOne(@Param('id') id: string){
        return this.productsService.findOne(id);
    }

    // Rota restrita: apenas ADMIN pode criar produtos
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @ApiForbiddenResponse({ description: 'Requer papel ADMIN' })
    @ApiCreatedResponse({ type: ProductWithCategoryResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos ou categoria não encontrada' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createProductDto: CreateProductDto){
        return this.productsService.create(createProductDto);
    }

    // Rota restrita: apenas ADMIN pode editar produtos (atualização parcial)
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @ApiForbiddenResponse({ description: 'Requer papel ADMIN' })
    @ApiOkResponse({ type: ProductWithCategoryResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos ou categoria não encontrada' })
    @ApiNotFoundResponse({ description: 'Produto não encontrado' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto){
        return this.productsService.update(id, updateProductDto);
    }

    // Rota restrita: apenas ADMIN pode remover produtos
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @ApiForbiddenResponse({ description: 'Requer papel ADMIN' })
    @ApiOkResponse({ type: ProductResponseDto, description: 'Produto removido' })
    @ApiNotFoundResponse({ description: 'Produto não encontrado' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.productsService.remove(id);
    }
}
