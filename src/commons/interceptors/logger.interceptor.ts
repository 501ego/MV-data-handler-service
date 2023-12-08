import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class RpcLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RPCLogger')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((responseData) => {
        const trace = responseData?.traceId || 'N/A'
        this.logger.log(
          `LOG [TraceId:${trace}] - [${context.getHandler().name} - REQUEST]`,
        )
      }),
    )
  }
}
