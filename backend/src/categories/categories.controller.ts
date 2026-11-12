import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CategoryResponseDto, CategoryWithCountResponseDto } from './dto/category-response.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    // Rota pública: o menu e a home dependem da lista de categorias
    @ApiOkResponse({ type: [CategoryWithCountResponseDto] })
    @Get()
    findAll(){
        return this.categoriesService.findAll();
    }

    // Rota restrita: apenas ADMIN pode criar categorias
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @ApiForbiddenResponse({ description: 'Requer papel ADMIN' })
    @ApiCreatedResponse({ type: CategoryResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos' })
    @ApiConflictResponse({ description: 'Já existe uma categoria com esse nome' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto){
        return this.categoriesService.create(createCategoryDto);
    }

    // Rota restrita: apenas ADMIN pode remover categorias (409 se houver produtos)
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @ApiForbiddenResponse({ description: 'Requer papel ADMIN' })
    @ApiOkResponse({ type: CategoryResponseDto, description: 'Categoria removida' })
    @ApiNotFoundResponse({ description: 'Categoria não encontrada' })
    @ApiConflictResponse({ description: 'Categoria possui produtos' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.categoriesService.remove(id);
    }
}
