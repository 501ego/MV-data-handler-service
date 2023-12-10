import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp()
      const response = ctx.getResponse()
      const request = ctx.getRequest()

      const traceValue = request.headers.trace

      console.log('HTTP Request Trace:', traceValue)

      return next.handle().pipe(
        map((data) => {
          console.log('HTTP Response Data:', data)
          return {
            trace: traceValue,
            code: response.statusCode,
            message: 'successful',
            data: data?.items ? data.items : data?.data ? data.data : data,
            pagination: data?.meta
              ? data.meta
              : data?.pagination
                ? data.pagination
                : undefined,
          }
        }),
      )
    } else if (context.getType() === 'rpc') {
      const rpcContext = context.switchToRpc()
      const data = rpcContext.getData()
      const traceValue = data?.trace

      return next.handle().pipe(
        map((responseData) => {
          return {
            trace: traceValue,
            data: responseData,
          }
        }),
      )
    }
  }
}
