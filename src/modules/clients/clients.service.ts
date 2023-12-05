import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Client } from './entities/client.entity'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private repository: Repository<Client>,
  ) {}

  create(name: string, email: string, password: string) {
    const client = this.repository.create({ name, email, password })
    return this.repository.save(client)
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Client not found')
    }
    return this.repository.findOne({ where: { id } })
  }

  find(email: string) {
    if (!email) {
      throw new NotFoundException('Client not found')
    }
    return this.repository.findOne({ where: { email } })
  }

  async findAll() {
    return this.repository.find()
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
