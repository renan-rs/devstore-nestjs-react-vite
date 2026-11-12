import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ example: 'Periféricos', maxLength: 50 })
    @IsString()
    @IsNotEmpty({message: 'O nome da categoria é obrigatório'})
    @MaxLength(50, {message: 'O nome da categoria deve ter no máximo 50 caracteres'})
    name: string;
}
