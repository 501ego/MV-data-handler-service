import { Controller, Param } from '@nestjs/common'
import { LoansService } from './loans.service'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { MessagePattern } from '@nestjs/microservices'
import { RpcException } from '@nestjs/microservices'
import { RabbitMqTraceInterceptor } from '../../commons/interceptors/trace.interceptor'
import { UseInterceptors } from '@nestjs/common'
import { Serialize } from 'src/commons/interceptors/serialize.interceptor'
import { LoanDto } from './dtos/loan.dto'

@UseInterceptors(RabbitMqTraceInterceptor)
@Controller()
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Serialize(LoanDto)
  @MessagePattern({ cmd: 'create-loan' })
  async create(data: any) {
    const createLoanDto: CreateLoanDto = data.createLoanDto
    try {
      return await this.loansService.create(createLoanDto)
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @MessagePattern({ cmd: 'get-loans' })
  async findAll() {
    const loans = await this.loansService.findAll()
    if (!loans) {
      return { status: 'not found', data: null }
    }
    return { status: 'success', data: loans }
  }

  @MessagePattern({ cmd: 'get-loans-by-client' })
  async findByClient(data: { clientId: number }) {
    const loans = await this.loansService.findByClient(data.clientId)
    if (!loans) {
      return { status: 'not found', data: null }
    }
    return { status: 'success', data: loans }
  }

  @MessagePattern({ cmd: 'get-loan-by-id' })
  async findOne(data: { id: number }) {
    const loan = await this.loansService.findOne(data.id)
    if (!loan) {
      return { status: 'not found', data: null }
    }
    return { status: 'success', data: loan }
  }

  @MessagePattern({ cmd: 'pay-loan' })
  async payLoan(data: { id: number; attrs: any }) {
    const loan = await this.loansService.payLoan(data.id, data.attrs)
    if (!loan) {
      throw new RpcException('Loan not found')
    }
    return { status: 'success', data: loan }
  }

  @MessagePattern({ cmd: 'update-loan' })
  //TODO admin guard
  async update(data: any) {
    return await this.loansService.update(data.id, data.attrs)
  }

  @MessagePattern({ cmd: 'delete-loan' })
  //TODO admin guard
  async remove(@Param('id') id: number) {
    return await this.loansService.remove(id)
  }
}
