import { IsNumber } from 'class-validator'

export class CreateOrderDto {
  @IsNumber()
  productId: number

  @IsNumber()
  quantity: number

  @IsNumber()
  unitPrice: number
}
