import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async create(createUserDto: CreateUserDto){
        const userExists = await this.prisma.user.findUnique({
            where: {email: createUserDto.email},
        });

        if(userExists){
            throw new ConflictException('E-mail já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });

        // Remove a senha do objeto de retorno por segurança
        const {password, ...result} = user;
        return result;
    }

    async findByEmail(email: string){
        return this.prisma.user.findUnique({
            where: {email},
        });
    }

    async findByid(id: string){
        const user = await this.prisma.user.findUnique({
            where: {id},
        });

        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        const {password, ...result} = user;
        return result;
    }
}
