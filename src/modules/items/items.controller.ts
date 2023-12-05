import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common'

import { ItemsService } from './items.service'
import { CreateItemDto } from './dtos/create-item.dto'
import { UpdateItemDto } from './dtos/update-item.dto'

//TODO Guard(Admin) crear guard para admin
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() body: CreateItemDto) {
    return this.itemsService.create(body.name, body.quantity, body.unitPrice)
  }

  @Get()
  async findAll() {
    const items = await this.itemsService.findAll()
    return items
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const item = await this.itemsService.findOne(id)
    if (!item) {
      throw new NotFoundException('Item not found')
    }
    return item
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() body: Partial<UpdateItemDto>) {
    const item = await this.itemsService.update(id, body)
    if (!item) {
      throw new NotFoundException('Item not found')
    }
    return item
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.itemsService.remove(id)
  }
}
