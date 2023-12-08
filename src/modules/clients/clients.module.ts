import { Module, MiddlewareConsumer } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './entities/client.entity'
import { CurrentClientMiddleware } from './middlewares/current-client.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentClientMiddleware).forRoutes('*')
  }
}
