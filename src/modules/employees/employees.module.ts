import { Module } from '@nestjs/common'
import { EmployeesController } from './employees.controller'
import { EmployeesService } from './employees.service'
import { Employee } from './entities/employee.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})

//TODO apply currentEmployeeMiddleware
export class EmployeesModule {}
