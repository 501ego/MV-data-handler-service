import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'

import { LoansService } from './loans.service'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { UpdateLoanDto } from './dtos/update-loan.dto'
import { AuthGuard } from 'src/commons/guards/auth.guard'

import { CurrentClient } from '../clients/decorators/current-client.decorator'
import { Client } from '../clients/entities/client.entity'

@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateLoanDto, @CurrentClient() client: Client) {
    const loan = await this.loansService.create(
      body.amount,
      body.interest,
      client,
    )
    return loan
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.loansService.findAll()
  }

  @Get('/client')
  @UseGuards(AuthGuard)
  async findByClient(@CurrentClient() client: Client) {
    return await this.loansService.findByClient(client)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    return await this.loansService.findOne(id)
  }

  @Patch(':id')
  //TODO admin guard
  async update(@Param('id') id: number, @Body() body: UpdateLoanDto) {
    return await this.loansService.update(id, body)
  }

  @Delete(':id')
  //TODO admin guard
  async remove(@Param('id') id: number) {
    return await this.loansService.remove(id)
  }
}
