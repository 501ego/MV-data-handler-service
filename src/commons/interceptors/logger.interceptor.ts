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
import { catchError } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'

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
        this.rabbitPublisher.publishLogMessage(logMessage).catch((error) => {
          this.logger.error('Failed to publish log message to RabbitMQ', error)
        })
      }),
      catchError((error) => {
        const trace = uuidv4()
        const logMessage = `ERROR [${this.serviceName}] [TraceId:${trace}] - [${handlerName}] - [${className}] - ${error.message}`
        this.logger.error(logMessage)
        this.rabbitPublisher
          .publishLogMessage(logMessage)
          .catch((publishError) => {
            this.logger.error(
              'Failed to publish error log message to RabbitMQ',
              publishError,
            )
          })
        throw error
      }),
    )
  }
}
