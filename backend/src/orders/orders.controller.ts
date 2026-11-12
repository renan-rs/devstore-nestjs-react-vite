import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @ApiCreatedResponse({ type: OrderResponseDto })
    @ApiBadRequestResponse({ description: 'Dados inválidos ou estoque insuficiente' })
    @ApiNotFoundResponse({ description: 'Produto não encontrado' })
    @Post()
    create(@Req() req: any, @Body() createOrderDto: CreateOrderDto){
        const userId = req.user.userId;
        return this.ordersService.create(userId, createOrderDto);
    }

    @ApiOkResponse({ type: [OrderResponseDto], description: 'Pedidos do usuário autenticado' })
    @Get()
    findAllByUser(@Req() req: any){
        const userId = req.user.userId;
        return this.ordersService.findAllByUser(userId);
    }

    @Get(':id')
    findOne(@Req() req: any, @Param('id') id: string){
        const { userId, role } = req.user;
        return this.ordersService.findOne(id, userId, role);
    }
}
