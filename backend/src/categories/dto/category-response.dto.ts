import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: 'Periféricos' })
    name: string;

    @ApiProperty({ example: 'perifericos' })
    slug: string;

    @ApiProperty()
    createdAt: Date;
}

class CategoryCountDto {
    @ApiProperty({ example: 3 })
    products: number;
}

export class CategoryWithCountResponseDto extends CategoryResponseDto {
    @ApiProperty({ type: CategoryCountDto })
    _count: CategoryCountDto;
}
