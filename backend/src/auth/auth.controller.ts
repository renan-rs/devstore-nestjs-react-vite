import { Controller, Post, Get, Body, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiCreatedResponse({ type: UserResponseDto, description: 'Usuário criado (sem a senha)' })
    @ApiBadRequestResponse({ description: 'Dados inválidos' })
    @ApiConflictResponse({ description: 'E-mail já cadastrado' })
    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos' })
    @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: UserResponseDto })
    @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Request() req: { user: { userId: string } }) {
        return this.authService.getProfile(req.user.userId);
    }
}
