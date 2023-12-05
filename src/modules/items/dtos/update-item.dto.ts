import { IsOptional, IsNumber, IsString } from 'class-validator'

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  name: string

  @IsNumber()
  @IsOptional()
  quantity: number

  @IsNumber()
  @IsOptional()
  unitPrice: number
}
