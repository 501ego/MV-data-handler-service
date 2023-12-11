import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Employee } from './entities/employee.entity'
import { EmployeeDto } from './dtos/employee.dto'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private repository: Repository<Employee>,
  ) {}

  test(data: any) {
    return data
  }

  async create(
    rut: string,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
  ): Promise<EmployeeDto> {
    const employee = this.repository.create({
      rut,
      name,
      email,
      password,
      isAdmin,
    })
    await this.repository.save(employee)
    return new EmployeeDto(employee)
  }

  findOne(id: number) {
    if (!id) {
      throw new RpcException('Employee not found')
    }
    return this.repository.findOne({ where: { id } })
  }

  async findOneByEmail(email: string) {
    const exist = await this.repository.findOne({ where: { email } })
    if (!exist) {
      return null
    }
    return exist
  }

  async findAll(options: {
    take: number
    skip: number
  }): Promise<[Employee[], number]> {
    const [employees, total] = await this.repository.findAndCount({
      take: options.take,
      skip: options.skip,
    })
    return [employees, total]
  }

  async update(id: number, attrs: Partial<Employee>) {
    const employee = await this.findOne(id)
    if (!employee) {
      throw new RpcException('Employee not found')
    }
    Object.assign(employee, attrs)
    return this.repository.save(employee)
  }

  async remove(id: number) {
    const employee = await this.findOne(id)
    if (!employee) {
      throw new RpcException('Employee not found')
    }
    await this.repository.remove(employee)
  }
}
