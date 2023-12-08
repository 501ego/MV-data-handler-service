import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { Client } from '../../clients/entities/client.entity'

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @Column()
  interest: number

  @Column()
  total: number

  @Column()
  date: Date

  @Column({ default: 'pending' })
  status: string

  @Column({ default: 0 })
  payment: number

  @ManyToOne(() => Client, (client) => client.loans)
  client: Client
}
