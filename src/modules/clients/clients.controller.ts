import { Controller, UseInterceptors } from '@nestjs/common'
import { Client } from './entities/client.entity'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dtos/create-client.dto'
import { UpdateClientDto } from './dtos/update-user.dto'
import { MessagePattern } from '@nestjs/microservices'
import { RabbitMqTraceInterceptor } from '../../commons/interceptors/trace.interceptor'
import { ClientResponseDto } from './dtos/client-response.dto'

@UseInterceptors(RabbitMqTraceInterceptor)
@Controller()
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @MessagePattern({ cmd: 'test' })
  test(data: any) {
    return this.clientsService.test(data)
  }

  @MessagePattern({ cmd: 'create-client' })
  async createClient(data: CreateClientDto): Promise<ClientResponseDto> {
    try {
      return await this.clientsService.create(
        data.name,
        data.email,
        data.password,
      )
    } catch (error) {
      // Handle the error appropriately
      throw error
    }
  }

  @MessagePattern({ cmd: 'find-client-by-email' })
  async findClientByEmail(data: {
    email: string
  }): Promise<{ status: string; data: Client | null }> {
    const client = await this.clientsService.findOneByEmail(data.email)
    if (!client) {
      return { status: 'not found', data: null }
    }
    return { status: 'success', data: client }
  }

  @MessagePattern({ cmd: 'get-client-by-id' })
  async findClient(data: {
    id: number
  }): Promise<{ status: string; data: Client | null }> {
    try {
      const client = await this.clientsService.findOne(data.id)
      if (!client) {
        return { status: 'not found', data: null }
      }
      return { status: 'success', data: client }
    } catch (error) {
      throw error
    }
  }

  @MessagePattern({ cmd: 'get-all-clients' })
  async findAllClients(data: {
    page?: number
    limit?: number
  }): Promise<{ status: string; data: Client[]; pagination?: any }> {
    const { page = 1, limit = 10 } = data
    const [clients, total] = await this.clientsService.findAll({
      take: limit,
      skip: (page - 1) * limit,
    })
    const pagination = { page, limit, total }
    return { status: 'success', data: clients, pagination }
  }

  @MessagePattern({ cmd: 'update-client' })
  async updateClient(data: {
    id: number
    clientData: UpdateClientDto
  }): Promise<{ status: string; data: Client }> {
    try {
      const client = await this.clientsService.update(data.id, data.clientData)
      return { status: 'success', data: client }
    } catch (error) {
      throw error
    }
  }

  @MessagePattern({ cmd: 'delete-client' })
  async removeClient(data: {
    id: number
  }): Promise<{ status: string; message: string }> {
    try {
      await this.clientsService.remove(data.id)
      return { status: 'success', message: 'Client removed successfully' }
    } catch (error) {
      throw error
    }
  }
}
