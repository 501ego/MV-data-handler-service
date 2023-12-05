import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ClientsService } from '../clients.service'
import { Client } from '../entities/client.entity'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentClient?: Client
      session?: {
        clientId?: string
      }
    }
  }
}

@Injectable()
export class CurrentClientMiddleware implements NestMiddleware {
  constructor(private clientsService: ClientsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { clientId } = req.session || {}
    if (clientId) {
      const client = await this.clientsService.findOne(parseInt(clientId))
      req.currentClient = client
    }
    next()
  }
}
