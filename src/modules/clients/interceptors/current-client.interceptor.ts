import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common'
import { ClientsService } from '../clients.service'

@Injectable()
export class CurrentClientInterceptor implements NestInterceptor {
  constructor(private clientsService: ClientsService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest()
    const { clientId } = request.session || {}
    if (clientId) {
      const client = await this.clientsService.findOne(parseInt(clientId))
      request.currentClient = client
    }
    return handler.handle()
  }
}
