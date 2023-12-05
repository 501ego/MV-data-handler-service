import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Order } from '../../orders/entities/order.entity'

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[]
}
