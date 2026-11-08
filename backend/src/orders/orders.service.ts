import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from '@prisma/client';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService){}

    async create(userId: string, createOrderDto: CreateOrderDto){
        let totalAmount = 0;
        const orderItemsData: {productId: string, quantity: number, price: number}[] = [];

        // Valida produtos e calcula o valor total
        for(const item of createOrderDto.items){
            const product = await this.prisma.product.findUnique({
                where: {id: item.productId},
            });

            if(!product){
                throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
            }

            if(product.stock < item.quantity){
                throw new BadRequestException(`Estoque insuficiente para o produto: ${product.name}`);
            }

            totalAmount += product.price * item.quantity;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price, // Salva o preço do momento da compra
            });
        }

        // Cria o pedido e reduz o estoque em uma transação segura
        return this.prisma.$transaction(async (tx) => {
            // Cria o pedido principal
            const order = await tx.order.create({
                data: {
                    userId,
                    total: totalAmount,
                    status: 'PENDING',
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            });

            // Atualize o estoque de cada produto comprado
            for (const item of createOrderDto.items){
                await tx.product.update({
                    where: {id: item.productId},
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return order;
        });
    }

    async findAllByUser(userId: string){
        return this.prisma.order.findMany({
            where: {userId},
            include: {
                items: {
                    include: { product:true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string, userRole: string){
        const order = await this.prisma.order.findUnique({
            where: {id},
            include: {
                items: {
                    include: { product: true },
                },
                user: {
                    select: {id: true, name: true, email: true},
                },
            },
        });

        if(!order){
            throw new NotFoundException('Pedido não encontrado');
        }

        // Se não for admin e o pedido não pertencer ao usuário, bloqueia o acesso
        if(userRole !== 'ADMIN' && order.userId !== userId){
            throw new BadRequestException('Você não tem permissão para visualizar este pedido')
        }

        return order;
    }
}
