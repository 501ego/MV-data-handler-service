import { Expose, Transform } from 'class-transformer'

export class ItemDto {
  @Expose()
  @Transform(({ value }) => value.name)
  name: string

  @Expose()
  @Transform(({ value }) => value.unitPrice)
  unitPrice: number
}
