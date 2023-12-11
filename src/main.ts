import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { RpcException } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'db_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }))
        return new RpcException({
          statusCode: 400,
          error: 'Bad Request',
          message: errorMessages,
        })
      },
    }),
  )
  await app.listen()
}
bootstrap()
