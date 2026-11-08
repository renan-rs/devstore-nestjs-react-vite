import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
    @IsString()
    @IsNotEmpty({message: 'O ID do produto é obrigatório'})
    productId: string;

    @IsNumber({}, {message: 'A quantidade deve ser um número'})
    @Min(1, {message: 'A quantidade mínima é 1'})
    quantity: number;
}