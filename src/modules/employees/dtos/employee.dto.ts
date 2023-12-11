import { Exclude, Expose } from 'class-transformer'
import { Employee } from '../entities/employee.entity'

export class EmployeeDto {
  @Expose()
  id: number

  @Exclude()
  rut: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  isAdmin: boolean

  constructor(employee: Employee) {
    this.id = employee.id
    this.rut = employee.rut
    this.name = employee.name
    this.email = employee.email
    this.isAdmin = employee.isAdmin
  }
}
