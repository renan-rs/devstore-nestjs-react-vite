import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";

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

    @IsInt({message: 'O estoque deve ser um número inteiro'})
    @Min(0, {message: 'O estoque não pode ser negativo'})
    stock: number;

    @IsString()
    @IsNotEmpty({message: 'A URL da imagem é obrigatória'})
    imageUrl: string;

    @IsUUID('all', {message: 'A categoria informada é inválida'})
    @IsNotEmpty({message: 'A categoria é obrigatória'})
    categoryId: string;
}