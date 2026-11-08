import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({message: 'O nome do produto é obrigatório'})
    name: string;

    @IsString()
    @IsNotEmpty({message: 'A cescrição é obrigatória'})
    description: string;

    @IsNumber({}, {message: 'O preço deve ser um número'})
    @Min(0, {message: 'O preço não pode ser negativo'})
    price: number;

    @IsNumber({}, {message: 'O estoque deve ser um número'})
    @Min(0, {message: 'O estoque não pode ser negativo'})
    stock: number;

    @IsString()
    @IsNotEmpty({message: 'A URL da imagem é obrigatória'})
    imageUrl: string;

    @IsString()
    @IsNotEmpty({message: 'A categoria é obrigatória'})
    category: string;
}