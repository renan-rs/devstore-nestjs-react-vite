import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto{
    @ApiProperty({ type: () => [CreateOrderItemDto] })
    @IsArray({message: 'Os itens do pedido devem ser uma lista'})
    @ArrayNotEmpty({message: 'O pedido deve conter pelo menos um item'})
    @ValidateNested({each: true})
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}