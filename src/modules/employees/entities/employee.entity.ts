import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  rut: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ default: false })
  isAdmin: boolean
}
