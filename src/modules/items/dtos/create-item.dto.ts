import { IsNumber, IsString } from 'class-validator'

export class CreateItemDto {
  @IsString()
  name: string

  @IsNumber()
  quantity: number

  @IsNumber()
  unitPrice: number
}
