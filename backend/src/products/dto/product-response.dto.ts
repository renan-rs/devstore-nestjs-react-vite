import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class ProductResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: 'Teclado Mecânico' })
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ example: 299.9 })
    price: number;

    @ApiProperty({ example: 10 })
    stock: number;

    @ApiProperty()
    imageUrl: string;

    @ApiProperty({ format: 'uuid' })
    categoryId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class ProductWithCategoryResponseDto extends ProductResponseDto {
    @ApiProperty({ type: CategoryResponseDto })
    category: CategoryResponseDto;
}
