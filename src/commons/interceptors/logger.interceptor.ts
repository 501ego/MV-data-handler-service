import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { RabbitPublisherService } from '../../modules/publisher/rabbit-publisher.service'

@Injectable()
export class RpcLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RPCLogger')
  private serviceName = 'data-handler-service'

  constructor(private readonly rabbitPublisher: RabbitPublisherService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerName = context.getHandler().name
    const className = context.getClass().name

    return next.handle().pipe(
      tap((responseData) => {
        const trace = responseData?.traceId || 'N/A'
        const logMessage = `LOG [${this.serviceName}] [TraceId:${trace}] - [${handlerName}] - [${className}] - RESPONSE`

        this.logger.log(logMessage)

        // Publicar al RabbitMQ
        this.rabbitPublisher.publishLogMessage(logMessage).catch((error) => {
          this.logger.error('Failed to publish log message to RabbitMQ', error)
        })
      }),
    )
  }
}
