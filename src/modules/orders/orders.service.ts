import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { Client } from '../clients/entities/client.entity'
import { CreateOrderDto } from './dtos/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repository: Repository<Order>) {}

  async create(attrs: CreateOrderDto, clientId: number) {
    const client = new Client()
    client.id = clientId
    const order = this.repository.create({
      ...attrs,
      client,
    })
    return this.repository.save(order)
  }

  async findAll(clientId: number) {
    return this.repository.find({ where: { client: { id: clientId } } })
  }

  async findOne(id: number, clientId: number) {
    return this.repository.findOne({
      where: { id, client: { id: clientId } },
      relations: ['item'],
    })
  }

  async update(id: number, attrs: Partial<Order>) {
    const order = await this.findOne(id, attrs.client.id)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    Object.assign(order, attrs)
    return this.repository.save(order)
  }

  async remove(id: number, clientId: number) {
    const order = await this.findOne(id, clientId)
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    await this.repository.remove(order)
  }
}
