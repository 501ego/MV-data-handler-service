import { Module, MiddlewareConsumer } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './entities/client.entity'
import { AuthService } from '../auth/auth.service'
import { CurrentClientMiddleware } from './middlewares/current-client.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [ClientsService, AuthService],
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentClientMiddleware).forRoutes('*')
  }
}
