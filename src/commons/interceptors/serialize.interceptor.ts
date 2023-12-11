import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'

type ClassType<T> = {
  new (...args: any[]): T
}

export function Serialize<T>(dto: ClassType<T>) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassType<T>) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        if (data) {
          const serializedData = Array.isArray(data)
            ? data.map((item) =>
                plainToInstance(this.dto, item, {
                  excludeExtraneousValues: true,
                }),
              )
            : plainToInstance(this.dto, data, {
                excludeExtraneousValues: true,
              })
          return serializedData
        }
        return data
      }),
    )
  }
}
