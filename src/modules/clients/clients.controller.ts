import {
  Controller,
  Get,
  Post,
  Body,
  Session,
  UseGuards,
  NotFoundException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'
import { Client } from './entities/client.entity'
import { ClientsService } from './clients.service'
import { AuthService } from '../auth/auth.service'
import { CreateClientDto } from './dtos/create-client.dto'
import { updateClientDto } from './dtos/update-user.dto'
import { AuthGuard } from '../../commons/guards/auth.guard'
import { CurrentClient } from './decorators/current-client.decorator'
import { Serialize } from 'src/commons/interceptors/serialize.interceptor'
import { ClientDto } from './dtos/client.dto'

@Serialize(ClientDto)
@Controller('auth')
export class ClientsController {
  constructor(
    private clientsService: ClientsService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async create(
    @Body() body: CreateClientDto,
    @Session() session: any,
  ): Promise<Client> {
    const client = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    )
    session.clientId = client.id
    return client
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentClient() client: Client): Client {
    return client
  }

  @Post('/signin')
  async signin(@Body() body: CreateClientDto, @Session() session: any) {
    const client = await this.authService.signin(body.email, body.password)
    session.clientId = client.id
    return client
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.clientId = null
  }

  @Get('/:id')
  async findClient(@Param('id') id: string): Promise<Client> {
    const client = await this.clientsService.findOne(parseInt(id))
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    return client
  }

  @Get()
  findAllClients(): Promise<Client[]> {
    return this.clientsService.findAll()
  }

  @Patch('/:id')
  async updateClient(
    @Param('id') id: string,
    @Body() body: updateClientDto,
  ): Promise<Client> {
    const client = await this.clientsService.update(parseInt(id), body)
    if (!client) {
      throw new NotFoundException('Client not found')
    }
    return client
  }

  @Delete('/:id')
  async removeClient(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(parseInt(id))
  }
}
