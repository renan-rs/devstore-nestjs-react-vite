import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Teclado Mecânico' })
    @IsString()
    @IsNotEmpty({message: 'O nome do produto é obrigatório'})
    name: string;

    @ApiProperty({ example: 'Teclado mecânico RGB com switches blue' })
    @IsString()
    @IsNotEmpty({message: 'A descrição é obrigatória'})
    description: string;

    @ApiProperty({ example: 299.9, minimum: 0 })
    @IsNumber({}, {message: 'O preço deve ser um número'})
    @Min(0, {message: 'O preço não pode ser negativo'})
    price: number;

    @ApiProperty({ example: 10, minimum: 0 })
    @IsInt({message: 'O estoque deve ser um número inteiro'})
    @Min(0, {message: 'O estoque não pode ser negativo'})
    stock: number;

    @ApiProperty({ example: 'https://exemplo.com/teclado.png' })
    @IsString()
    @IsNotEmpty({message: 'A URL da imagem é obrigatória'})
    imageUrl: string;

    @ApiProperty({ description: 'ID da categoria', format: 'uuid' })
    @IsUUID('all', {message: 'A categoria informada é inválida'})
    @IsNotEmpty({message: 'A categoria é obrigatória'})
    categoryId: string;
}