import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from './modules/clients/clients.module'
import { LoansModule } from './modules/loans/loans.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './modules/clients/entities/client.entity'
import { Loan } from './modules/loans/entities/loan.entity'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { RpcLoggerInterceptor } from './commons/interceptors/logger.interceptor'
import { RabbitMQModule } from './modules/publisher/rabbit.module'
@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        entities: [Client, Loan],
      }),
    }),
    ClientsModule,
    LoansModule,
    RabbitMQModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcLoggerInterceptor,
    },
  ],
})
export class AppModule {}
