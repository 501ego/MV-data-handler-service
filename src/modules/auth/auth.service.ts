import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ClientsService } from '../clients/clients.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private clientsService: ClientsService) {}

  async signup(name: string, email: string, password: string) {
    const clients = await this.clientsService.find(email)
    if (clients) {
      throw new ConflictException('email in use')
    }

    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    const client = await this.clientsService.create(name, email, hash)

    return client
  }

  async signin(email: string, password: string) {
    const client = await this.clientsService.find(email)
    if (!client) {
      throw new NotFoundException('invalid email')
    }

    const isMatch = await bcrypt.compare(password, client.password)
    if (!isMatch) {
      throw new ConflictException('bad password')
    }

    return client
  }
}
