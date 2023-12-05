import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { Client } from '../../clients/entities/client.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Client, (client) => client.orders)
  client: Client

  @Column({ default: 'pending' })
  status: string
}
