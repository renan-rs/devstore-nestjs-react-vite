import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
    @ApiProperty({ description: 'ID do produto', format: 'uuid' })
    @IsString()
    @IsNotEmpty({message: 'O ID do produto é obrigatório'})
    productId: string;

    @ApiProperty({ example: 1, minimum: 1 })
    @IsNumber({}, {message: 'A quantidade deve ser um número'})
    @Min(1, {message: 'A quantidade mínima é 1'})
    quantity: number;
}