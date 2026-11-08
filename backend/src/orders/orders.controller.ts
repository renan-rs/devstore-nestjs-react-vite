import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService){}

    @Post()
    create(@Req() req: any, @Body() createOrderDto: CreateOrderDto){
        const userId = req.user.userId;
        return this.ordersService.create(userId, createOrderDto);
    }

    @Get()
    findAllByUser(@Req() req: any){
        const userId = req.user.userId;
        return this.ordersService.findAllByUser(userId);
    }

    @Get('id')
    findOne(@Req() req: any, @Param('id') id: string){
        const { userId, role } = req.user;
        return this.ordersService.findOne(id, userId, role);
    }
}
