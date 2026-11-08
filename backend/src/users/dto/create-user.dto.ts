import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message: 'O nome é obrigatório'})
    name: string;

    @IsEmail({}, {message: 'Informe um e-mail válido'})
    email: string;

    @IsString()
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caracteres'})
    password: string;

    @IsOptional()
    @IsEnum(Role, {message: 'Papel inválido (USER ou ADMIN)'})
    role?: Role;
}