import { IsOptional, IsString, IsNumber } from 'class-validator'

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  clientId: number

  @IsNumber()
  @IsOptional()
  productId: number

  @IsNumber()
  @IsOptional()
  quantity: number

  @IsNumber()
  @IsOptional()
  total: number

  @IsString()
  @IsOptional()
  status: string
}
