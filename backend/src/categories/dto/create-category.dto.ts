import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({message: 'O nome da categoria é obrigatório'})
    @MaxLength(50, {message: 'O nome da categoria deve ter no máximo 50 caracteres'})
    name: string;
}
