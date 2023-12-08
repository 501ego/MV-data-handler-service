import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Loan } from './entities/loan.entity'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { UpdateLoanDto } from './dtos/update-loan.dto'
import { Client } from '../clients/entities/client.entity'

@Injectable()
export class LoansService {
  constructor(@InjectRepository(Loan) private repository: Repository<Loan>) {}

  async create(
    amount: number,
    interest: number,
    client: Client,
  ): Promise<Loan> {
    const total = amount + (amount * interest) / 100
    const loan = this.repository.create({
      amount,
      interest,
      total,
      client,
      date: new Date(),
      status: 'pending',
    })

    return await this.repository.save(loan)
  }

  async findAll() {
    return await this.repository.find()
  }

  async findByClient(client: Client) {
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    return await this.repository.find({ where: { client } })
  }

  async findOne(id: number): Promise<Loan> {
    const loan = await this.repository.findOneBy({ id })
    if (!loan) {
      throw new NotFoundException('Loan not found')
    }
    return loan
  }

  async update(id: number, attrs: Partial<Loan>) {
    const loan = await this.findOne(id)
    if (!loan) {
      throw new NotFoundException('Loan not found')
    }
    Object.assign(loan, attrs)
    return await this.repository.save(loan)
  }

  async remove(id: number) {
    const loan = await this.findOne(id)
    if (!loan) {
      throw new NotFoundException('Loan not found')
    }
    return await this.repository.remove(loan)
  }
}
