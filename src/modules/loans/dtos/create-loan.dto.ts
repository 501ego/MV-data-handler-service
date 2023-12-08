import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator'
import { Client } from 'src/modules/clients/entities/client.entity'
export class CreateLoanDto {
  client: Client

  @IsNumber()
  amount: number

  @IsNumber()
  interest: number

  @IsNumber()
  @IsOptional()
  total: number

  @IsDate()
  @IsOptional()
  date: Date

  @IsString()
  @IsOptional()
  status: string

  @IsNumber()
  @IsOptional()
  payment: number
}
