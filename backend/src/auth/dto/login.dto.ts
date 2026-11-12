import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class LoginDto{
    @ApiProperty({ example: 'user@devstore.com' })
    @IsEmail({}, {message: 'Informe um e-mail válido'})
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caracteres'})
    password: string;
}