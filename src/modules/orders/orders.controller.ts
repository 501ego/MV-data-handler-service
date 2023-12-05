import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  NotFoundException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'

import { OrdersService } from './orders.service'
import { AuthGuard } from '../../commons/guards/auth.guard'
import { CurrentClient } from '../clients/decorators/current-client.decorator'
import { Client } from '../clients/entities/client.entity'
import { Order } from './entities/order.entity'
import { UpdateOrderDto } from './dtos/update-order.dto'
import { Serialize } from '../../commons/interceptors/serialize.interceptor'
import { OrderDto } from './dtos/order.dto'
import { CreateOrderDto } from './dtos/create-order.dto'

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(OrderDto)
  async create(
    @Body() body: CreateOrderDto,
    @CurrentClient() client: Client,
  ): Promise<Order> {
    const order = await this.ordersService.create(body, client.id)
    return order
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@CurrentClient() client: Client) {
    const orders = await this.ordersService.findAll(client.id)
    return orders
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number, @CurrentClient() client: Client) {
    const order = await this.ordersService.findOne(id, client.id)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() body: Partial<UpdateOrderDto>,
  ): Promise<Order> {
    const order = await this.ordersService.update(id, body)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    return order
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number, @CurrentClient() client: Client) {
    return this.ordersService.remove(id, client.id)
  }
}
