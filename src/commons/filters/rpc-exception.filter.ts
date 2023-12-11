import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError()
    const errorMessage =
      typeof error === 'string'
        ? error
        : error['message'] || 'An unknown error occurred'
    return throwError(() => ({
      status: 'error',
      message: errorMessage,
    }))
  }
}
