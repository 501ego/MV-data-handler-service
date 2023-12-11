import { Module } from '@nestjs/common'
import { LoansController } from './loans.controller'
import { LoansService } from './loans.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Loan } from './entities/loan.entity'
import { ClientsModule } from '../clients/clients.module'
@Module({
  imports: [TypeOrmModule.forFeature([Loan]), ClientsModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
