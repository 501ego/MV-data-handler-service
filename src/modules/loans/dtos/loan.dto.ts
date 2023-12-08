import { Expose } from 'class-transformer'

export class LoanDto {
  @Expose()
  id: number

  @Expose()
  client: string

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
}
