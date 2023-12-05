import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '../items/entities/item.entity'

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Item) private repository: Repository<Item>) {}

  create(name: string, stock: number, unitPrice: number) {
    const item = this.repository.create({
      name,
      stock,
      unitPrice,
    })
    return this.repository.save(item)
  }

  async findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    return this.repository.findOne({ where: { id } })
  }

  async update(id: number, attrs: Partial<Item>) {
    const item = await this.findOne(id)
    if (!item) {
      throw new NotFoundException('Item not found')
    }
    Object.assign(item, attrs)
    return this.repository.save(item)
  }

  async remove(id: number) {
    const item = await this.findOne(id)
    if (!item) {
      throw new NotFoundException('Item not found')
    }
    await this.repository.remove(item)
  }
}
