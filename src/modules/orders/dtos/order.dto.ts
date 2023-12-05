import { Expose, Transform } from 'class-transformer'

export class OrderDto {
  @Expose()
  id: number

  @Expose()
  @Transform(({ obj }) => obj.id)
  itemId: number

  @Expose()
  name: string

  @Expose()
  quantity: number

  @Expose()
  unitPrice: number
}
