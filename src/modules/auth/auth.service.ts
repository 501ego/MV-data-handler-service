import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ClientsService } from '../clients/clients.service'
import { createCipheriv, randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private clientsService: ClientsService) {}

  async signup(name: string, email: string, password: string) {
    const clients = await this.clientsService.find(email)
    if (clients) {
      throw new ConflictException('email in use')
    }
    const salt = randomBytes(8).toString('hex')
    const hash = (await scrypt(password, salt, 32)) as Buffer
    const result = salt + '.' + hash.toString('hex')
    const client = await this.clientsService.create(name, email, result)
    return client
  }

  async signin(email: string, password: string) {
    const client = await this.clientsService.find(email)
    if (!client) {
      throw new NotFoundException('invalid email')
    }
    const [salt, storedHash] = client.password.split('.')
    const hash = (await scrypt(password, salt, 32)) as Buffer
    if (storedHash !== hash.toString('hex')) {
      throw new ConflictException('bad password')
    }
    return client
  }
}
