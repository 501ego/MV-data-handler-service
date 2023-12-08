import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ClientsService } from '../clients.service'

@Injectable()
export class CurrentClientInterceptor implements NestInterceptor {
  constructor(private clientsService: ClientsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const clientId = request.session?.clientId

    if (clientId) {
      return next.handle().pipe(
        map(async (data: any) => {
          const client = await this.clientsService.findOne(parseInt(clientId))
          request.currentClient = client
          return data
        }),
      )
    } else {
      return next.handle()
    }
  }
}
