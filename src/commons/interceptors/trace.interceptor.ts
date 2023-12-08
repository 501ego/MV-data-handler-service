import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { map } from 'rxjs/operators'

@Injectable()
export class RabbitMqTraceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const traceId = data.traceId || uuidv4()
        return {
          ...data,
          traceId,
        }
      }),
    )
  }
}
