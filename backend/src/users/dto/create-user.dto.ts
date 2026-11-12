import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
    @ApiProperty({ example: 'João Silva' })
    @IsString()
    @IsNotEmpty({message: 'O nome é obrigatório'})
    name: string;

    @ApiProperty({ example: 'joao@devstore.com' })
    @IsEmail({}, {message: 'Informe um e-mail válido'})
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caracteres'})
    password: string;

    @ApiPropertyOptional({ enum: Role, default: Role.USER })
    @IsOptional()
    @IsEnum(Role, {message: 'Papel inválido (USER ou ADMIN)'})
    role?: Role;
}