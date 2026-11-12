import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class OrderItemResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    orderId: string;

    @ApiProperty({ format: 'uuid' })
    productId: string;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({ description: 'Preço unitário no momento da compra', example: 299.9 })
    price: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({ type: ProductResponseDto })
    product: ProductResponseDto;
}

export class OrderResponseDto {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: 599.8 })
    total: number;

    @ApiProperty({ enum: OrderStatus, enumName: 'OrderStatus' })
    status: OrderStatus;

    @ApiProperty({ format: 'uuid' })
    userId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];
}
