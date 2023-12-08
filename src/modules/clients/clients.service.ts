import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Client } from './entities/client.entity'
import { ClientResponseDto } from './dtos/client-response.dto'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private repository: Repository<Client>,
  ) {}

  test(data: any) {
    return data
  }

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<ClientResponseDto> {
    const client = this.repository.create({ name, email, password })
    await this.repository.save(client)

    // Create an instance of ClientResponseDto from the saved Client entity
    return new ClientResponseDto(client)
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Client not found')
    }
    return this.repository.findOne({ where: { id } })
  }

  async findOneByEmail(email: string) {
    const exist = await this.repository.findOne({ where: { email } })
    if (!exist) {
      return null
    }
    return exist
  }

  async findAll(options: {
    take: number
    skip: number
  }): Promise<[Client[], number]> {
    const [clients, total] = await this.repository.findAndCount({
      take: options.take,
      skip: options.skip,
    })
    return [clients, total]
  }

  async update(id: number, attrs: Partial<Client>) {
    const client = await this.findOne(id)
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    Object.assign(client, attrs)
    return this.repository.save(client)
  }

  async remove(id: number) {
    const client = await this.findOne(id)
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    await this.repository.remove(client)
  }
}
