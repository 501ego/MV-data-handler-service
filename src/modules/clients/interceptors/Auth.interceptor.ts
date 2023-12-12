import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class RpcAuthenticationInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message = context.switchToRpc().getData()
    const authToken = message.authToken
    try {
      const user = this.jwtService.verify(authToken)
      return next.handle()
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
