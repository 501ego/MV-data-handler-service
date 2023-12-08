import { Expose } from 'class-transformer'
import { Client } from '../entities/client.entity'

export class ClientResponseDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string

  constructor(client: Client) {
    this.id = client.id
    this.name = client.name
    this.email = client.email
  }
}
