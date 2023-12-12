import { Module } from '@nestjs/common'
import { LoansController } from './loans.controller'
import { LoansService } from './loans.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Loan } from './entities/loan.entity'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ClientsModule as ClientM } from '../clients/clients.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    ClientM,
    ClientsModule.register([
      {
        name: 'BUSINESS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'business_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
