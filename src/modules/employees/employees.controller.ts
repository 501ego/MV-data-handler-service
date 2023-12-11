import { Controller, UseInterceptors } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { RabbitMqTraceInterceptor } from '../../commons/interceptors/trace.interceptor'
import { Employee } from './entities/employee.entity'
import { CreateEmployeeDto } from './dtos/create-employee.dto'
import { UpdateEmployeeDto } from './dtos/update-employee.dto'
import { EmployeesService } from './employees.service'
import { EmployeeDto } from './dtos/employee.dto'
import { RpcException } from '@nestjs/microservices'

@UseInterceptors(RabbitMqTraceInterceptor)
@Controller()
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @MessagePattern({ cmd: 'test' })
  test(data: any) {
    return this.employeesService.test(data)
  }

  @MessagePattern({ cmd: 'create-employee' })
  async createEmployee(data: CreateEmployeeDto): Promise<EmployeeDto> {
    try {
      return await this.employeesService.create(
        data.rut,
        data.name,
        data.email,
        data.password,
        data.isAdmin,
      )
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @MessagePattern({ cmd: 'find-employee-by-email' })
  async findEmployeeByEmail(data: {
    email: string
  }): Promise<{ status: string; data: Employee | null }> {
    const employee = await this.employeesService.findOneByEmail(data.email)
    if (!employee) {
      return { status: 'not found', data: null }
    }
    return { status: 'success', data: employee }
  }

  @MessagePattern({ cmd: 'get-employee-by-id' })
  async findEmployee(data: {
    id: number
  }): Promise<{ status: string; data: Employee | null }> {
    try {
      const employee = await this.employeesService.findOne(data.id)
      if (!employee) {
        return { status: 'not found', data: null }
      }
      return { status: 'success', data: employee }
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @MessagePattern({ cmd: 'get-all-employees' })
  async findAllEmployees(data: {
    page?: number
    limit?: number
  }): Promise<{ status: string; data: Employee[]; pagination?: any }> {
    const { page = 1, limit = 10 } = data
    const [employees, total] = await this.employeesService.findAll({
      take: limit,
      skip: (page - 1) * limit,
    })
    const pagination = { page, limit, total }
    return { status: 'success', data: employees, pagination }
  }

  @MessagePattern({ cmd: 'update-employee' })
  async updateEmployee(data: {
    id: number
    employeeData: UpdateEmployeeDto
  }): Promise<{ status: string; data: Employee }> {
    try {
      const employee = await this.employeesService.update(
        data.id,
        data.employeeData,
      )
      return { status: 'success', data: employee }
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  @MessagePattern({ cmd: 'delete-employee' })
  async removeEmployee(data: {
    id: number
  }): Promise<{ status: string; message: string }> {
    try {
      await this.employeesService.remove(data.id)
      return { status: 'success', message: 'Employee removed successfully' }
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
