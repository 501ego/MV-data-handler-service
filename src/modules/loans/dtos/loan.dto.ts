import { Expose, Type } from 'class-transformer'

export class ClientDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string
}

export class LoanDto {
  @Expose()
  id: number

  @Expose()
  amount: number

  @Expose()
  interest: number

  @Expose()
  total: number

  @Expose()
  date: Date

  @Expose()
  status: string

  @Expose()
  payment: number

  @Type(() => ClientDto)
  @Expose()
  client: ClientDto
}
