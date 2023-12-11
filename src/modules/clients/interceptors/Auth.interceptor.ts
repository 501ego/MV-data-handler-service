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
    const authToken = message.authToken // Suponiendo que el token viene en el mensaje RCP bajo la propiedad `authToken`.

    try {
      const user = this.jwtService.verify(authToken) // Verifica el token y obtiene el usuario.
      // Aquí podrías agregar lógica adicional para verificar si el usuario es un admin, por ejemplo.
      return next.handle() // Continúa con la ejecución si el token es válido.
    } catch (error) {
      throw new UnauthorizedException() // Lanza una excepción si el token es inválido.
    }
  }
}
