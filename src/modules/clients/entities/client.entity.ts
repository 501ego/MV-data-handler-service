import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Loan } from 'src/modules/loans/entities/loan.entity'

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

  @OneToMany(() => Loan, (loan) => loan.client)
  loans: Loan[]
}
