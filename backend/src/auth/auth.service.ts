import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    async validateUser(email: string, pass: string){
        const user = await this.usersService.findByEmail(email);
        if(user && (await bcrypt.compare(pass, user.password))){
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto){
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if(!user){
            throw new UnauthorizedException('E-mail ou senha inválidos');
        }

        const payload = {sub: user.id, email: user.email, role: user.role};

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
