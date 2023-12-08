import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator'

export class UpdateLoanDto {
  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsNumber()
  interest: number

  @IsOptional()
  @IsNumber()
  total: number

  @IsOptional()
  @IsDate()
  date: Date

  @IsOptional()
  @IsString()
  status: string

  @IsOptional()
  @IsNumber()
  payment: number
}
