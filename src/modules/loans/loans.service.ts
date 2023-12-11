import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Loan } from './entities/loan.entity'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { Client } from '../clients/entities/client.entity'
import { ClientsService } from '../clients/clients.service'

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repository: Repository<Loan>,
    private clientsService: ClientsService,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<Loan> {
    const client = await this.clientsService.findOne(createLoanDto.clientId)
    if (!client) {
      throw new NotFoundException(
        `Client with ID ${createLoanDto.clientId} not found`,
      )
    }
    const total =
      createLoanDto.amount +
      (createLoanDto.amount * createLoanDto.interest) / 100

    // Creating a new loan object
    const loan = this.repository.create({
      amount: createLoanDto.amount,
      interest: createLoanDto.interest,
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
