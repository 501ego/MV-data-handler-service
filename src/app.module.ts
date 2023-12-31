import {
  Module,
  MiddlewareConsumer,
  ValidationPipe,
  RequestMethod,
} from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from './modules/clients/clients.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ItemsModule } from './modules/items/items.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from './modules/clients/entities/client.entity'
import { Order } from './modules/orders/entities/order.entity'
import { Item } from './modules/items/entities/item.entity'
import cookieSession = require('cookie-session')
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { LoggerMiddleware } from './commons/middlewares/logger.middleware'
import { TraceMiddleware } from './commons/middlewares/trace.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          entities: [Client, Order, Item],
        }
      },
    }),
    ClientsModule,
    ItemsModule,
    OrdersModule,
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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['asdf'] })).forRoutes('*')
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}
