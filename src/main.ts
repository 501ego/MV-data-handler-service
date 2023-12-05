import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ExceptionFilter } from './commons/filters/exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Usar el filtro de excepciones globalmente
  app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost)))

  // Opcional: Registra un ValidationPipe global si aún deseas utilizar esta funcionalidad
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Si quieres transformar el payload directamente a tus clases DTO
    }),
  )

  await app.listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
